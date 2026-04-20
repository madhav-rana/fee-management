require("dotenv").config();
require("../config/database");

// We have to register all models explicitly here
require("../models/student.model");
require("../models/payment.model");
require("../models/branch.model");
require("../models/feeStructure.model");
require("../models/admin.model");

const receiptQueue = require("../config/queue");
const Payment = require("../models/payment.model");
const Student = require("../models/student.model");
const generateReceiptPDF = require("../utils/generateReceiptPDF");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const sendReceiptEmail = require("../utils/sendReceiptEmail");

console.log("👷 Receipt Worker started...");

receiptQueue.process(async (job) => {
  const { paymentId, studentId, fine } = job.data;

  const payment = await Payment.findById(paymentId);
  const student = await Student.findById(studentId)
    .populate("branch")
    .populate("feeStructure");

  if (!payment || !student) {
    throw new Error(`Payment or student not found for job ${job.id}`);
  }

  console.log(`⏳ Processing receipt for ${student.name} | ${payment.receiptNumber}`);

  // Generate PDF
  const pdfBuffer = await generateReceiptPDF({
    ...payment.toObject(),
    student,
    fineApplied: fine,
  });
  console.log(`📄 PDF generated`);

  // Upload to Cloudinary
  const pdfUrl = await uploadToCloudinary(pdfBuffer, payment.receiptNumber);
  payment.receiptPdfUrl = pdfUrl;
  console.log(`☁️ Uploaded to Cloudinary`);

  // Send Email
  if (student.email) {
    await sendReceiptEmail(student.email, pdfBuffer, payment.receiptNumber);
    payment.receiptEmailSent = true;
    console.log(`📧 Email sent`);
  }

  payment.automationStatus = "success";
  await payment.save();

  console.log(`✅ Done for ${payment.receiptNumber}`);
});

receiptQueue.on("active", (job) => {
  console.log(`🔄 Job #${job.id} is now active`);
});

receiptQueue.on("error", (err) => {
  console.error("🔥 Queue error:", err.message);
});

receiptQueue.on("waiting", (jobId) => {
  console.log(`⏳ Job #${jobId} is waiting`);
});

receiptQueue.on("failed", async (job, err) => {
  console.error(`❌ Job #${job.id} failed:`, err.message);

  await Payment.findByIdAndUpdate(job.data.paymentId, {
    automationStatus: "failed",
    automationError: err.message,
  });
});