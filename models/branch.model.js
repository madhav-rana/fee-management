const mongoose = require("mongoose");
const branchSchema = new mongoose.Schema({
  code: {
    type: String,
    enum: ["cse", "me", "ee", "civil", "ece", "ip", "ic"],
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Branch", branchSchema);