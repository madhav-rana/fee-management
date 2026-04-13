const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
    required: true
  },
  email: {
    type: String,
    unique: true,
    require: true,
    match: /.+\@.+\..+/
  },
  address: {
    type: String
  },
  dateOfAdmission: {
    type: Date,
    required: true,
    default: Date.now
  },
  feeStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeeStructure",
    required: true
  }
});

// studentSchema.index({ rollNo: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ year: 1 });

module.exports = mongoose.model("Student", studentSchema);
