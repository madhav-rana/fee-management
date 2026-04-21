const Student = require("../models/student.model");
const FeeStructure = require("../models/feeStructure.model");
const Payment = require("../models/payment.model");
const Branch = require("../models/branch.model");
const exportPDF = require("../utils/exportPDF");


// REPORT HOME
exports.getReportHome = (req, res) => {
  res.render("report/index");
};


// BRANCH REPORT

exports.getBranchReport = async (req, res) => {
  const { academicYear, branch, year, export: exportType } = req.query;

  // fetch all fee structures
  const allFeeStructures = await FeeStructure.find().sort({ academicYear: -1 });
  // fetch all branches
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
  if (year) {
    studentMatch.year = Number(year);
  }

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

  // if (report.length === 0) {
  //   req.flash("error", "No data found for selected filters");
  //   return res.redirect("/api/v1/reports");
  // }

  const viewData = {
    report,
    academicYear: feeStructure.academicYear,
    allFeeStructures,
    branches,
    selectedBranch: branch || "",
    selectedYear: year || "",
  };

  if (exportType === "pdf") {
    return exportPDF(res, "branch-report", viewData, "branch-report");
  }

  res.render("report/branch-report", viewData);
};


// DURATION REPORT

exports.getDurationReport = async (req, res) => {
  const { from, to, branch, year, export: exportType } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

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
  if (Object.keys(dateFilter).length > 0) matchStage.paymentDate = dateFilter;

  const branches = await Branch.find().sort({ name: 1 });

  const aggregationPipeline = [
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
    ...(year ? [{ $match: { "student.year": Number(year) } }] : []),
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
  ];

  // PDF export — no pagination, fetch all
  if (exportType === "pdf") {
    const report = await Payment.aggregate(aggregationPipeline);
    const grandTotal = report.reduce((sum, r) => sum + r.totalPaid, 0);
    return exportPDF(res, "duration-report", {
      report, from, to, branch, year: year || "", branches, grandTotal
    }, "collection-report");
  }

  // get grandTotal from full result before paginating
  const fullReport = await Payment.aggregate(aggregationPipeline);
  const grandTotal = fullReport.reduce((sum, r) => sum + r.totalPaid, 0);
  const totalCount = fullReport.length;
  const totalPages = Math.ceil(totalCount / limit);

  // paginated result
  const report = await Payment.aggregate([
    ...aggregationPipeline,
    { $skip: skip },
    { $limit: limit },
  ]);

  res.render("report/duration-report", {
    report,
    from,
    to,
    branch,
    year: year || "",
    branches,
    grandTotal,
    currentPage: page,
    totalPages,
    totalCount,
  });
};


// STUDENT STATUS REPORT

exports.getStudentStatusReport = async (req, res) => {
  const { branch, year, academicYear, filter, export: exportType } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

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

  // shared pipeline — no skip/limit
  const aggregationPipeline = [
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
  ];

  // PDF export — no pagination, fetch all
  if (exportType === "pdf") {
    const report = await Student.aggregate(aggregationPipeline);
    return exportPDF(res, "student-status", {
      report, branches, allFeeStructures,
      branch: branch || "", year: year || "",
      academicYear: academicYear || "", filter: filter || "",
    }, "status-report");
  }

  // Normal page load — paginated
  const totalCount = await Student.aggregate([
    ...aggregationPipeline,
    { $count: "count" }
  ]);
  const total = totalCount[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const report = await Student.aggregate([
    ...aggregationPipeline,
    { $skip: skip },
    { $limit: limit },
  ]);

  res.render("report/student-status", {
    report,
    branches,
    allFeeStructures,
    branch: branch || "",
    year: year || "",
    academicYear: academicYear || "",
    filter: filter || "",
    currentPage: page,
    totalPages,
    totalCount: total,
  });
};

// HOSTEL REPORT

exports.getHostelReport = async (req, res) => {
  const { branch, year, type, export: exportType } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const branches = await Branch.find().sort({ name: 1 });
  const studentMatch = {};

  if (branch) {
    const branchDoc = await Branch.findOne({ code: branch });
    if (branchDoc) studentMatch.branch = branchDoc._id;
  }

  if (year) studentMatch.year = Number(year);
  if (type === "hosteler") studentMatch.isHosteller = true;
  if (type === "dayscholar") studentMatch.isHosteller = false;

  const aggregationPipeline = [
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
  ];

  // PDF export — fetch all, no pagination
  if (exportType === "pdf") {
    const report = await Student.aggregate(aggregationPipeline);
    return exportPDF(res, "hostel-report", { report, branch, year, type }, "hostel-report");
  }

  // Normal page load — paginated
  const totalCount = await Student.countDocuments(studentMatch);
  const totalPages = Math.ceil(totalCount / limit);

  const report = await Student.aggregate([
    ...aggregationPipeline,
    { $skip: skip },
    { $limit: limit },
  ]);

  const viewData = {
    report,
    branches,
    branch: branch || "",
    year: year || "",
    type: type || "",
    currentPage: page,
    totalPages,
    totalCount,
  };

  res.render("report/hostel-report", viewData);
};