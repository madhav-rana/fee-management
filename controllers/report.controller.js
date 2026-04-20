// report.controller.js
const Student = require("../models/student.model");
const FeeStructure = require("../models/feeStructure.model");
const Payment = require("../models/payment.model");
const Branch = require("../models/branch.model");
const path = require("path");
const generatePDF = require("../utils/pdfGenerator");

// ================= REPORT HOME =================
exports.getReportHome = (req, res) => {
  res.render("report/index");
};

// ================= BRANCH REPORT =================
// exports.getBranchReport = async (req, res) => {
//   const { academicYear, export: exportType } = req.query;

//   const feeQuery = academicYear ? { academicYear } : {};
//   const feeStructure = await FeeStructure.findOne(feeQuery);

//   if (!feeStructure) {
//     req.flash("error", academicYear  // 🆕 flash instead of render with error
//       ? `No fee structure found for ${academicYear}`
//       : "No fee structure found"
//     );
//     return res.redirect("/api/v1/reports");
//   }

//   const report = await Student.aggregate([
//     { $match: { feeStructure: feeStructure._id } },
//     {
//       $group: {
//         _id: "$branch",
//         totalStudents: { $sum: 1 },
//         studentIds: { $push: "$_id" },
//       },
//     },
//     {
//       $lookup: {
//         from: "branches",
//         localField: "_id",
//         foreignField: "_id",
//         as: "branch",
//       },
//     },
//     { $unwind: "$branch" },
//     {
//       $lookup: {
//         from: "payments",
//         let: { students: "$studentIds" },
//         pipeline: [
//           { $match: { $expr: { $in: ["$student", "$$students"] } } },
//           { $group: { _id: null, totalCollected: { $sum: "$amountPaid" } } },
//         ],
//         as: "paymentData",
//       },
//     },
//     {
//       $addFields: {
//         totalCollected: {
//           $ifNull: [{ $arrayElemAt: ["$paymentData.totalCollected", 0] }, 0],
//         },
//         expectedAmount: {
//           $multiply: ["$totalStudents", feeStructure.totalAmount],
//         },
//       },
//     },
//     {
//       $addFields: {
//         pendingAmount: { $subtract: ["$expectedAmount", "$totalCollected"] },
//       },
//     },
//     {
//       $project: {
//         branchCode: "$branch.code",
//         branchName: "$branch.name",
//         totalStudents: 1,
//         expectedAmount: 1,
//         totalCollected: 1,
//         pendingAmount: 1,
//       },
//     },
//   ]);

//   // 🆕 empty report check
//   if (report.length === 0) {
//     req.flash("error", "No data found for this academic year");
//     return res.redirect("/api/v1/reports");
//   }

//   const viewData = { report, academicYear: feeStructure.academicYear };

//   if (exportType === "pdf") {
//     const pdfBuffer = await generatePDF(
//       path.join(__dirname, "../views/report/pdf/branch-report.ejs"),
//       viewData
//     );
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=branch-report.pdf",
//     });
//     return res.send(pdfBuffer);
//   }

//   res.render("report/branch-report", viewData);
// };

// ================= DURATION REPORT =================
exports.getBranchReport = async (req, res) => {
  const { academicYear, branch, year, export: exportType } = req.query;

  // fetch all fee structures for dropdown
  const allFeeStructures = await FeeStructure.find().sort({ academicYear: -1 });
  const branches = await Branch.find().sort({ name: 1 });

  const feeQuery = academicYear ? { academicYear } : {};
  const feeStructure = await FeeStructure.findOne(feeQuery);

  if (!feeStructure) {
    req.flash("error", academicYear
      ? `No fee structure found for ${academicYear}`
      : "No fee structure found"
    );
    return res.redirect("/api/v1/reports");
  }

  // build student match
  const studentMatch = { feeStructure: feeStructure._id };
  if (branch) {
    const branchDoc = await Branch.findOne({ code: branch });
    if (branchDoc) studentMatch.branch = branchDoc._id;
  }
  if (year) studentMatch.year = Number(year);

  const report = await Student.aggregate([
    { $match: studentMatch },
    {
      $group: {
        _id: { branch: "$branch", year: "$year" },
        totalStudents: { $sum: 1 },
        studentIds: { $push: "$_id" },
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "_id.branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "payments",
        let: { students: "$studentIds" },
        pipeline: [
          { $match: { $expr: { $in: ["$student", "$$students"] } } },
          { $group: { _id: null, totalCollected: { $sum: "$amountPaid" } } },
        ],
        as: "paymentData",
      },
    },
    {
      $addFields: {
        totalCollected: {
          $ifNull: [{ $arrayElemAt: ["$paymentData.totalCollected", 0] }, 0],
        },
        expectedAmount: {
          $multiply: ["$totalStudents", feeStructure.totalAmount],
        },
      },
    },
    {
      $addFields: {
        pendingAmount: { $subtract: ["$expectedAmount", "$totalCollected"] },
      },
    },
    {
      $project: {
        branchCode: "$branch.code",
        branchName: "$branch.name",
        year: "$_id.year",
        totalStudents: 1,
        expectedAmount: 1,
        totalCollected: 1,
        pendingAmount: 1,
      },
    },
    { $sort: { branchName: 1, year: 1 } },
  ]);

  if (report.length === 0) {
    req.flash("error", "No data found for selected filters");
    return res.redirect("/api/v1/reports");
  }

  const viewData = {
    report,
    academicYear: feeStructure.academicYear,
    allFeeStructures,
    branches,
    selectedBranch: branch || "",
    selectedYear: year || "",
  };

  if (exportType === "pdf") {
    const pdfBuffer = await generatePDF(
      path.join(__dirname, "../views/report/pdf/branch-report.ejs"),
      viewData
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=branch-report.pdf",
    });
    return res.send(pdfBuffer);
  }

  res.render("report/branch-report", viewData);
};



exports.getDurationReport = async (req, res) => {
  const { from, to, branch, year, export: exportType } = req.query;

  // 🆕 date validation
  if (from && to && new Date(from) > new Date(to)) {
    req.flash("error", "From date cannot be after To date");
    return res.redirect("/api/v1/reports/duration");
  }

  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    dateFilter.$lte = end;
  }

  const matchStage = {};
  if (Object.keys(dateFilter).length > 0) {
    matchStage.paymentDate = dateFilter;
  }

  const report = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$student",
        totalPaid: { $sum: "$amountPaid" },
        paymentsCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $lookup: {
        from: "branches",
        localField: "student.branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    ...(year ? [{ $match: { "student.year": Number(year) } }] : []),//new
    ...(branch ? [{ $match: { "branch.code": branch } }] : []),
    {
      $project: {
        _id: 0,
        studentName: "$student.name",
        rollNo: "$student.rollNo",
        branchName: "$branch.name",
        branchCode: "$branch.code",
        totalPaid: 1,
        paymentsCount: 1,
      },
    },
    { $sort: { totalPaid: -1 } },
  ]);

  const grandTotal = report.reduce((sum, r) => sum + r.totalPaid, 0);
  const branches = await Branch.find().sort({ name: 1 });

  // const viewData = { report, from, to, branch, branches, grandTotal };
  const viewData = { report, from, to, branch, year: year || "", branches, grandTotal };

  if (exportType === "pdf") {
    const pdfBuffer = await generatePDF(
      path.join(__dirname, "../views/report/pdf/duration-report.ejs"),
      viewData
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=collection-report.pdf",
    });
    return res.send(pdfBuffer);
  }

  res.render("report/duration-report", viewData);
};

// ================= STUDENT STATUS REPORT =================
// exports.getStudentStatusReport = async (req, res) => {
//   const { branch, filter, export: exportType } = req.query;

//   // 🆕 validate filter value
//   if (filter && !["paid", "unpaid"].includes(filter)) {
//     req.flash("error", "Invalid filter value");
//     return res.redirect("/api/v1/reports/student-status");
//   }

//   const branches = await Branch.find().sort({ name: 1 });
//   const studentMatch = {};

//   if (branch) {
//     const branchDoc = await Branch.findOne({ code: branch });
//     if (!branchDoc) { // 🆕 invalid branch check
//       req.flash("error", `Branch "${branch}" not found`);
//       return res.redirect("/api/v1/reports/student-status");
//     }
//     studentMatch.branch = branchDoc._id;
//   }

//   const report = await Student.aggregate([
//     { $match: studentMatch },
//     {
//       $lookup: {
//         from: "feestructures",
//         localField: "feeStructure",
//         foreignField: "_id",
//         as: "feeStructure",
//       },
//     },
//     { $unwind: "$feeStructure" },
//     {
//       $lookup: {
//         from: "payments",
//         localField: "_id",
//         foreignField: "student",
//         as: "payments",
//       },
//     },
//     {
//       $addFields: {
//         totalPaid: { $sum: "$payments.amountPaid" },
//         totalFee: "$feeStructure.totalAmount",
//       },
//     },
//     {
//       $addFields: {
//         status: {
//           $cond: [{ $eq: ["$totalPaid", "$totalFee"] }, "PAID", "UNPAID"],
//         },
//       },
//     },
//     {
//       $match: {
//         ...(filter === "paid" && { status: "PAID" }),
//         ...(filter === "unpaid" && { status: "UNPAID" }),
//       },
//     },
//     {
//       $lookup: {
//         from: "branches",
//         localField: "branch",
//         foreignField: "_id",
//         as: "branch",
//       },
//     },
//     { $unwind: "$branch" },
//     {
//       $project: {
//         name: 1,
//         rollNo: 1,
//         status: 1,
//         branchName: "$branch.name",
//         branchCode: "$branch.code",
//       },
//     },
//     { $sort: { status: 1, name: 1 } },
//   ]);

//   const viewData = { report, branches, branch, filter };

//   if (exportType === "pdf") {
//     const pdf = await generatePDF(
//       path.join(__dirname, "../views/report/pdf/student-status.ejs"),
//       viewData
//     );
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=status-report.pdf",
//     });
//     return res.send(pdf);
//   }

//   res.render("report/student-status", viewData);
// };




exports.getStudentStatusReport = async (req, res) => {
  const { branch, year, academicYear, filter, export: exportType } = req.query;

  if (filter && !["paid", "unpaid"].includes(filter)) {
    req.flash("error", "Invalid filter value");
    return res.redirect("/api/v1/reports/student-status");
  }

  const branches = await Branch.find().sort({ name: 1 });
  const allFeeStructures = await FeeStructure.find().sort({ academicYear: -1 });
  const studentMatch = {};

  if (branch) {
    const branchDoc = await Branch.findOne({ code: branch });
    if (!branchDoc) {
      req.flash("error", `Branch "${branch}" not found`);
      return res.redirect("/api/v1/reports/student-status");
    }
    studentMatch.branch = branchDoc._id;
  }

  if (year) studentMatch.year = Number(year);

  if (academicYear) {
    const feeDoc = await FeeStructure.findOne({ academicYear });
    if (feeDoc) studentMatch.feeStructure = feeDoc._id;
  }

  const report = await Student.aggregate([
    { $match: studentMatch },
    {
      $lookup: {
        from: "feestructures",
        localField: "feeStructure",
        foreignField: "_id",
        as: "feeStructure",
      },
    },
    { $unwind: "$feeStructure" },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "student",
        as: "payments",
      },
    },
    {
      $addFields: {
        totalPaid: { $sum: "$payments.amountPaid" },
        totalFee: "$feeStructure.totalAmount",
      },
    },
    {
      $addFields: {
        status: {
          $cond: [{ $eq: ["$totalPaid", "$totalFee"] }, "PAID", "UNPAID"],
        },
      },
    },
    {
      $match: {
        ...(filter === "paid" && { status: "PAID" }),
        ...(filter === "unpaid" && { status: "UNPAID" }),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $project: {
        name: 1,
        rollNo: 1,
        status: 1,
        year: 1,
        branchName: "$branch.name",
        branchCode: "$branch.code",
      },
    },
    { $sort: { status: 1, name: 1 } },
  ]);

  const viewData = {
    report,
    branches,
    allFeeStructures,
    branch: branch || "",
    year: year || "",
    academicYear: academicYear || "",
    filter: filter || "",
  };

  if (exportType === "pdf") {
    const pdf = await generatePDF(
      path.join(__dirname, "../views/report/pdf/student-status.ejs"),
      viewData
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=status-report.pdf",
    });
    return res.send(pdf);
  }

  res.render("report/student-status", viewData);
};



exports.getHostelReport = async (req, res) => {
  const { branch, year, type } = req.query;

  const branches = await Branch.find().sort({ name: 1 });
  const studentMatch = {};

  if (branch) {
    const branchDoc = await Branch.findOne({ code: branch });
    if (branchDoc) studentMatch.branch = branchDoc._id;
  }

  if (year) studentMatch.year = Number(year);

  // type filter
  if (type === "hosteler") studentMatch.isHosteller = true;
  if (type === "dayscholar") studentMatch.isHosteller = false;

  const report = await Student.aggregate([
    { $match: studentMatch },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $project: {
        name: 1,
        rollNo: 1,
        contactNumber: 1,
        isHosteller: 1,
        year: 1,
        branchName: "$branch.name",
        branchCode: "$branch.code",
      },
    },
    { $sort: { isHosteller: -1, name: 1 } },
  ]);

  res.render("report/hostel-report", {
    report,
    branches,
    branch: branch || "",
    year: year || "",
    type: type || "",
  });
};