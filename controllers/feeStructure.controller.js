// feeStructure.controller.js
const FeeStructure = require("../models/feeStructure.model");

// GET all fee structures
exports.getAllFeeStructures = async (req, res) => {
  const feeStructures = await FeeStructure.find().sort({ academicYear: -1 });
  res.render("admin/fee/index", { feeStructures });
};

// Show create form
exports.getNewFeeStructureForm = (req, res) => {
  res.render("admin/fee/new");
};

// Create new fee structure
exports.createFeeStructure = async (req, res) => {
  const { academicYear, course, breakdown, hostelFee, dueDate, finePerWeek } = req.body;

  if (!academicYear || !course || !breakdown || !hostelFee || !dueDate) { // 🆕
    req.flash("error", "Please fill all required fields");
    return res.redirect("/api/v1/fees/new");
  }

  // 🆕 check duplicate academic year
  const existing = await FeeStructure.findOne({ academicYear });
  if (existing) {
    req.flash("error", `Fee structure for ${academicYear} already exists`);
    return res.redirect("/api/v1/fees/new");
  }

  const feeStructure = new FeeStructure({
    academicYear,
    course,
    breakdown,
    hostelFee,
    dueDate,
    finePerWeek
  });

  await feeStructure.save();

  req.flash("success", `Fee structure for ${academicYear} created successfully`); // updated
  res.redirect("/api/v1/fees");
};

// Edit form
exports.getEditFeeStructureForm = async (req, res) => {
  const feeStructure = await FeeStructure.findById(req.params.id);

  if (!feeStructure) {
    req.flash("error", "Fee structure not found");
    return res.redirect("/api/v1/fees");
  }

  res.render("admin/fee/edit", { feeStructure });
};

// Update fee structure
exports.updateFeeStructure = async (req, res) => {
  const { id } = req.params;

  const fee = await FeeStructure.findById(id);

  if (!fee) { // 🆕
    req.flash("error", "Fee structure not found");
    return res.redirect("/api/v1/fees");
  }

  // using .save() instead of findByIdAndUpdate
  // to trigger pre-save middleware for totalAmount recalculation
  fee.breakdown = req.body.breakdown;
  fee.hostelFee = req.body.hostelFee;
  fee.dueDate = req.body.dueDate;
  fee.finePerWeek = req.body.finePerWeek;

  await fee.save();

  req.flash("success", `Fee structure updated successfully`); // updated
  res.redirect("/api/v1/fees");
};

// Delete fee structure — intentionally not exposed in routes (risky operation)
exports.deleteFeeStructure = async (req, res) => {
  const fee = await FeeStructure.findById(req.params.id); // 🆕 check before delete

  if (!fee) {
    req.flash("error", "Fee structure not found");
    return res.redirect("/api/v1/fees");
  }

  // 🆕 check if any student is using this fee structure
  const Student = require("../models/student.model");
  const linkedStudents = await Student.countDocuments({ feeStructure: req.params.id });

  if (linkedStudents > 0) {
    req.flash("error", `Cannot delete — ${linkedStudents} students are linked to this fee structure`);
    return res.redirect("/api/v1/fees");
  }

  await FeeStructure.findByIdAndDelete(req.params.id);
  req.flash("success", "Fee structure deleted");
  res.redirect("/api/v1/fees");
};