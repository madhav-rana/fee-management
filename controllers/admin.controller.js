// admin.controller.js
const Student = require("../models/student.model");
const Payment = require("../models/payment.model");
const FeeStructure = require("../models/feeStructure.model");
const Branch = require("../models/branch.model");
const calculateExpectedTotal = require("../utils/calculateExpectedTotal");

const fs = require("fs");
const csv = require("csv-parser");


// DASHBOARD 
exports.getDashboard = async (req, res) => {
  const students = await Student.find().populate("feeStructure");
  const payments = await Payment.find();

  let totalFeeExpected = 0;
  students.forEach((student) => {
    if (student.feeStructure) {
      totalFeeExpected += calculateExpectedTotal(student); // utility used
    }
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalPending = totalFeeExpected - totalCollected;

  const yearBreakdown = [1, 2, 3, 4].map(y => ({
    year: `Year ${y}`,
    count: students.filter(s => s.year === y).length
  }));

  res.render("admin/dashboard", {
    totalStudents: students.length,
    totalFeeExpected,
    totalCollected,
    totalPending,
    yearBreakdown,
  });
};


// SEARCH STUDENTS FORM
exports.getStudentSearchPage = (req, res) => {
  res.render("admin/student/search");
};


// SHOW STUDENT DETAILS
exports.searchStudent = async (req, res) => {
  const { query, year } = req.query;

  if (!query) {
    req.flash("error", "Please enter a name or roll number to search");
    return res.redirect("/api/v1/admin/students");
  }

  const filter = {
    ...(year && { year: Number(year) }),
    $or: [{ rollNo: query }, { name: new RegExp(query, "i") }],
  };

  const student = await Student.findOne(filter).populate("branch feeStructure");

  if (!student) {
    req.flash("error", `No student found for "${query}"`);
    return res.redirect("/api/v1/admin/students");
  }

  if (!student.feeStructure) {
    req.flash("error", "Student has no fee structure assigned. Please contact admin.");
    return res.redirect("/api/v1/admin/students");
  }

  const payments = await Payment.find({ student: student._id }).sort({ paymentDate: 1 });
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const expectedTotal = calculateExpectedTotal(student); // utility used
  const remainingBalance = expectedTotal - totalPaid;

  res.render("admin/student/show", {
    student,
    payments,
    totalPaid,
    remainingBalance,
    expectedTotal,
  });
};


//EDIT STUDENT DETAILS
exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id).populate("branch");
  const branches = await Branch.find();

  res.render("admin/student/edit", { student, branches }); 
};

// UPDATE STUDENT DETAILS
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const updatedStudent = await Student.findByIdAndUpdate(id, { ...req.body }, { new: true });
  
  req.flash("success", "Student information updated!");
  res.redirect(`/api/v1/admin/students/search?query=${updatedStudent.rollNo}`);
};


// ALL PAYMENTS 
exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate({ path: "student", populate: ["branch"] })
    .sort({ paymentDate: -1 });

  res.render("admin/payments", { payments });
};


// ACTIVATE / DEACTIVATE HOSTEL 
exports.toggleHostel = async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    req.flash("error", "Student not found");
    return res.redirect("/api/v1/admin/students");
  }

  student.isHosteller = !student.isHosteller; //update hostal status

  await student.save();

  req.flash("success", `Hostel status updated for ${student.name}`);
  res.redirect(`/api/v1/admin/students/search?query=${encodeURIComponent(student.rollNo)}`);
};


// ADD NEW STUDENT FORM
exports.getAddStudentPage = async (req, res) => {
  const branches = await Branch.find();
  const feeStructures = await FeeStructure.find();
  res.render("admin/student/new", { branches, feeStructures });
};

// ADD NEW STUDENT
exports.addStudent = async (req, res) => {
  console.log("Student :", req.body);
  const {
    name, rollNo, course, branch, year,
    contactNumber, email, isHosteller,
    feeStructure, dateOfAdmission, address,
  } = req.body;

  const branches = await Branch.find();
  const feeStructures = await FeeStructure.find();

  if (!name || !rollNo || !course || !branch || !year || !email || !address ||
      !contactNumber || !feeStructure || !dateOfAdmission) { 

    req.flash("error", "Please fill all required fields");
    // return res.render("admin/student/new", { branches, feeStructures });
    return res.redirect("/api/v1/admin/students/add")
  }

  const existingStudent = await Student.findOne({
    $or: [{ rollNo }, { email }]
  });

  if (existingStudent) {
    req.flash("error", "A student with this Roll No or Email already exists");
    return res.redirect("/api/v1/admin/students/add")
  }

  await Student.create({
    name, rollNo, course, branch, year,
    isHosteller,
    contactNumber,
    email,
    address,
    dateOfAdmission,
    feeStructure,
  });

  req.flash("success", `Student ${name} added successfully!`);
  res.redirect("/api/v1/admin/dashboard");
};

// BULK UPLOAD 
exports.bulkUploadStudents = async (req, res) => {
  const branches = await Branch.find();
  const feeStructures = await FeeStructure.find();

  if (!req.file) {
    req.flash("error", "Please upload a CSV file");
    return res.redirect("/api/v1/admin/students/add")
  }

  const students = [];
  const failedStudents = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => students.push(data))
    .on("error", (err) => { // stream error handling was missing
      req.flash("error", "Failed to read CSV file");
      return res.redirect("/api/v1/admin/students/add")
    })
    .on("end", async () => {
      try {
        const branchMap = {};
        branches.forEach((b) => (branchMap[b.name.trim()] = b._id));

        const feeMap = {};
        feeStructures.forEach((f) => (feeMap[f.academicYear.trim()] = f._id));

        const formattedStudents = [];

        for (let data of students) {
          console.log(data);
          let reason = "";

          if (!data.name || !data.rollNo) reason = "Missing name or rollNo";

          const branchId = branchMap[data.branch?.trim()];
          if (!branchId) reason = "Invalid branch";

          const feeId = feeMap[data.feeStructure?.trim()];
          if (!feeId) reason = "Invalid feeStructure";

          if (reason) {
            failedStudents.push({ ...data, reason });
            continue;
          }

          formattedStudents.push({
            name: data.name,
            rollNo: data.rollNo,
            course: "BTECH",
            branch: branchId,
            year: Number(data.year) || 1,
            isHosteller: data.isHosteller === "true",
            contactNumber: data.contactNumber,
            email: data.email,
            address: data.address,
            feeStructure: feeId,
          });
        }

        let insertedCount = 0;

        try {
          const result = await Student.insertMany(formattedStudents, { ordered: false });
          insertedCount = result.length;
          console.log("result : ", result);
          console.log("insertedCount : ", insertedCount);

        } catch (err) {
          if (err.code === 11000) {
            err.writeErrors?.forEach((e) => { // optional chaining
              const failedDoc = formattedStudents[e.index];
              failedStudents.push({
                name: failedDoc.name,
                rollNo: failedDoc.rollNo,
                reason: "Duplicate email or rollNo", // updated: cleaner
              });
            });
            insertedCount = err.result?.insertedCount || 0;
          } else {
            throw err; // re-throw unknown errors
          }
        }

        fs.unlinkSync(req.file.path); // delete uploaded file

        // req.flash("success", `${insertedCount} students added successfully`);

        // Smart flash handling
        if (insertedCount === 0) {
            req.flash("error", "No students were added. Please check your CSV data.");
        } else if (failedStudents.length > 0) {
            req.flash(
                "success",
                `${insertedCount} students added, ${failedStudents.length} failed`
            );
        } else {
            req.flash("success", `${insertedCount} students added successfully`);
        }

        // return res.render("admin/student/addStudent", {
        //   failedStudents,
        //   branches,
        //   feeStructures,
        // //   updated: removed inline success/error — using flash now
        // });
        return res.render("admin/student/new", { failedStudents, branches, feeStructures });

      } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path); // delete file even on error
        }
        throw err; // wrapAsync will handle it
      }
    });
};