// student.controller.js
const Student = require("../models/student.model");
const Payment = require("../models/payment.model");
const calculateExpectedTotal = require("../utils/calculateExpectedTotal"); // 🆕 utility function

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