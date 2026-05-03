const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    rollNo: {
      type: String,
      required: true,
      unique: true
    },
    course: {
      type: String,
      enum: ["BTECH"],
      required: true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true
    },
    isHosteller: { 
      type: Boolean,
      default: false
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Enter valid 10-digit number"]
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    address: {
      type: String,
      required: true
    },
    dateOfAdmission: {
      type: Date,
      required: true,
      // default: Date.now
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true
    }
  },
  { timestamps: true }
);

// studentSchema.index({ rollNo: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ year: 1 });

module.exports = mongoose.model("Student", studentSchema);
