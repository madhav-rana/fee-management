const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 1
    },
    paymentMode: {
      type: String,
      enum: ["cash", "card", "upi", "bank-transfer"],
      required: true
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true
    },
    receiptPdfUrl: {
      type: String
    },
    receiptEmailSent: {
      type: Boolean,
      default: false
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    // add transactionid
    transactionId: {
      type: String,
      default: null
    },
    automationStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    automationError: {
      type: String,
      default: null
    }

  },
  { timestamps: true }
);

paymentSchema.index({ student: 1 });
paymentSchema.index({ paymentDate: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
