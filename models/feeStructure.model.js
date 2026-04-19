const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        //format: YYYY-YYYY
        const parts = value.split("-");

        if (parts.length !== 2) return false;

        const startYear = parseInt(parts[0]);
        const endYear = parseInt(parts[1]);

        // Format must be valid
        if (endYear !== startYear + 1) return false;

        const currentYear = new Date().getFullYear();

        // Do not allow future academic years
        if (startYear > currentYear) return false;

        return true;
      },
      message: "Invalid academic year"
    }
  },
  course: {
    type: String,
    enum: ["BTECH"],
    required: true
  },
  breakdown: {
    tuition: { type: Number, required: true },
    cautionMoney: { type: Number, required: true },
    exam: { type: Number, required: true },
    activity: { type: Number, default: 0 },
    others: { type: Number, default: 0 }
  },
  hostelFee: { 
    type: Number,
    required: true,
    // default: 50000
  },
  totalAmount: {
    type: Number,
    min: 0 //Since it's auto-calculated, add protection by using min valu 0
  },
  
  dueDate: {
    type: Date,
    required: true
  },
  finePerWeek: {
    type: Number,
    default: 100,
    min: 0
  }
});
//  AUTO-CALCULATE totalAmount
feeStructureSchema.pre("save", async function () {
  this.totalAmount =
    this.breakdown.tuition +
    this.breakdown.cautionMoney +
    this.breakdown.exam +
    (this.breakdown.activity || 0) +
    (this.breakdown.others || 0) + 
    this.hostelFee;

});

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
