// student.controller.js
const Student = require("../models/student.model");
const Payment = require("../models/payment.model");
const calculateExpectedTotal = require("../utils/calculateExpectedTotal"); // 🆕 utility function
const Branch = require("../models/branch.model");
// Render search form
exports.getSearchPage = (req, res) => {
  res.render("student/student_search_form");
};

// Search student in db
exports.searchStudent = async (req, res) => {
  const { query, year } = req.query;

  if (!query) { // 🆕 missing query check
    req.flash("error", "Please enter a name or roll number to search");
    return res.redirect("/api/v1/students");
  }

  const filter = {
    ...(year && { year: Number(year) }),
    $or: [
      { rollNo: query },
      { name: new RegExp(query, "i") }
    ]
  };

  const student = await Student.findOne(filter).populate("branch feeStructure");

  if (!student) {
    req.flash("error", `No student found for "${query}"`); // updated: more specific message
    return res.redirect("/api/v1/students");
  }

  if (!student.feeStructure) { // 🆕 missing feeStructure check
    req.flash("error", "Student has no fee structure assigned. Please contact admin.");
    return res.redirect("/api/v1/students");
  }

  const payments = await Payment.find({ student: student._id }).sort({ paymentDate: 1 });

  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const expectedTotal = calculateExpectedTotal(student); // 🆕 utility function
  const remainingBalance = expectedTotal - totalPaid;

  res.render("student/show_student_details", {
    student,
    payments,
    totalPaid,
    remainingBalance,
    expectedTotal
  });
};

// 1. Edit Form Render karna
exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id).populate("branch");
    const branches = await Branch.find();
    
    // 🚩 PATH FIXED: Kyunki file 'admin/student/' folder ke andar hai
    res.render("admin/student/edit", { student, branches }); 
};

exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    
    // 1. Pehle data update karo
    const updatedStudent = await Student.findByIdAndUpdate(id, { ...req.body }, { new: true });
    
    req.flash("success", "Student information updated!");
    res.redirect(`/api/v1/admin/students/search?query=${updatedStudent.rollNo}`);
};