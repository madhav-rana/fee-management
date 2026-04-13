// payment.controller.js
const Razorpay = require("razorpay");

// Models
const Student = require("../models/student.model");
const Payment = require("../models/payment.model");

// Utils
const generateReceiptPDF = require("../utils/generateReceiptPDF");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const sendReceiptEmail = require("../utils/sendReceiptEmail");
const calculateFine = require("../utils/getLateFine");
const calculateExpectedTotal = require("../utils/calculateExpectedTotal");

// 🚩 Razorpay Instance - Ensure .env keys are correct
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= 1. RAZORPAY ORDER CREATION =================
exports.createOrder = async (req, res) => {
  try {
    const { amount, studentId } = req.body;

    // Debugging: Check if keys are loaded (Terminal check)
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("❌ ERROR: Razorpay Keys are missing in .env file");
        return res.status(500).json({ error: "Server Configuration Error: Keys missing" });
    }

    if (!amount || !studentId) {
      return res.status(400).json({ error: "Amount and Student ID are required" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Paise mein convert
      currency: "INR",
      receipt: `rcpt_${studentId.substring(0, 5)}_${Date.now()}`,
    };

    console.log(`⏳ Creating Order for Student: ${studentId}, Amount: ${amount}`);
    
    const order = await razorpay.orders.create(options);
    
    console.log("✅ Razorpay Order Created Successfully:", order.id);
    res.status(200).json(order);

  } catch (err) {
    // 🚩 Authentication Check (401 Fix)
    if (err.statusCode === 401) {
        console.error("🔥 Razorpay Auth Error: Your Key ID or Secret is incorrect.");
    }
    console.error("🔥 Razorpay Order Error Detail:", err);
    res.status(500).json({ error: err.description || "Could not create Razorpay order" });
  }
};

// ================= 2. PAYMENT PAGE =================
exports.renderPaymentPage = async (req, res) => {
  const { studentId } = req.query;

  if (!studentId) {
    req.flash("error", "Student ID is required");
    return res.redirect("/api/v1/students");
  }

  const student = await Student.findById(studentId)
    .populate("branch")
    .populate("feeStructure");

  if (!student) {
    req.flash("error", "Student not found");
    return res.redirect("/api/v1/students");
  }

  if (!student.feeStructure) {
    req.flash("error", "No fee structure assigned to this student");
    return res.redirect("/api/v1/students");
  }

  const expectedTotal = calculateExpectedTotal(student);
  const payments = await Payment.find({ student: student._id });
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const fine = calculateFine(student.feeStructure.dueDate, student.feeStructure.finePerWeek);
  const totalFeesWithFine = expectedTotal + fine;
  const remainingBalance = totalFeesWithFine - totalPaid;

  res.render("pay", {
    student,
    totalPaid,
    expectedTotal,
    remainingBalance,
    fineAmount: fine,
  });
};

// ================= 3. SAVE PAYMENT =================
exports.savePayment = async (req, res) => {
  const { studentId, amountPaid, paymentMode, razorpay_payment_id } = req.body;

  if (!studentId || !amountPaid || !paymentMode) {
    req.flash("error", "Missing required fields");
    return res.redirect(`/api/v1/payments/new?studentId=${studentId}`);
  }

  const student = await Student.findById(studentId)
    .populate("feeStructure")
    .populate("branch");

  if (!student || !student.feeStructure) {
    req.flash("error", "Student or fee data not found");
    return res.redirect("/api/v1/students");
  }

  // Prevent overpayment logic
  const expectedTotal = calculateExpectedTotal(student);
  const fine = calculateFine(student.feeStructure.dueDate, student.feeStructure.finePerWeek);
  const payments = await Payment.find({ student: student._id });
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const remainingBalance = (expectedTotal + fine) - totalPaid;

  if (Number(amountPaid) > remainingBalance) {
    req.flash("error", `Amount exceeds remaining balance of ₹${remainingBalance}`);
    return res.redirect(`/api/v1/payments/new?studentId=${studentId}`);
  }

  // 1. Save payment to DB
  const payment = await Payment.create({
    student: student._id,
    amountPaid: Number(amountPaid),
    paymentMode,
    transactionId: razorpay_payment_id || null,
    receiptNumber: `RCPT-${Date.now()}`,
    automationStatus: "pending"
  });

  // 2. Redirect immediately
  req.flash("success", "💰 Payment recorded successfully!");
  res.redirect(`/api/v1/payments/receipt/${payment._id}`);

  // 3. Background automation (PDF, Cloudinary, Email)
  setImmediate(async () => {
    try {
      const pdfBuffer = await generateReceiptPDF({
        ...payment.toObject(),
        student,
        fineApplied: fine,
      });

      const pdfUrl = await uploadToCloudinary(pdfBuffer, payment.receiptNumber);
      payment.receiptPdfUrl = pdfUrl;

      if (student.email) {
        await sendReceiptEmail(student.email, pdfBuffer, payment.receiptNumber);
        payment.receiptEmailSent = true;
      }

      payment.automationStatus = "success";
      await payment.save();
    } catch (err) {
      payment.automationStatus = "failed";
      payment.automationError = err.message;
      await payment.save();
      console.error(`❌ Automation failed:`, err.message);
    }
  });
};

// ================= 4. RECEIPT VIEW =================
exports.getReceipt = async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId).populate({
    path: "student",
    populate: ["branch", "feeStructure"],
  });

  if (!payment) {
    req.flash("error", "Receipt not found");
    return res.redirect("/api/v1/students");
  }

  const expectedTotal = calculateExpectedTotal(payment.student);
  res.render("receipt", { payment, expectedTotal });
};

// ================= 5. PDF SYNC =================
exports.getReceiptPDF = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate({
    path: "student",
    populate: ["branch", "feeStructure"],
  });

  if (!payment || !payment.student || !payment.student.feeStructure) {
    req.flash("error", "Missing data for PDF generation");
    return res.redirect("/api/v1/students");
  }

  if (payment.receiptPdfUrl) {
    return res.redirect(payment.receiptPdfUrl);
  }

  const fine = calculateFine(
    payment.student.feeStructure.dueDate,
    payment.student.feeStructure.finePerWeek
  );

  const pdfBuffer = await generateReceiptPDF({
    ...payment.toObject(),
    student: payment.student,
    fineApplied: fine,
  });

  const pdfUrl = await uploadToCloudinary(pdfBuffer, payment.receiptNumber);
  payment.receiptPdfUrl = pdfUrl;
  await payment.save();

  res.redirect(pdfUrl);
};