const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    length: 6  // or use match: /^\d{6}$/
  },
  otpExpiry: Date,

  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Admin", adminSchema);
