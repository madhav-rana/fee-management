const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const sendOtpEmail = require("../utils/sendOtpEmail");

// SHOW LOGIN PAGE
exports.getLogin = (req, res) => {
  res.render("admin/auth/login");
};


// LOGIN
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin || !admin.isVerified) {
    // return res.render("admin/auth/login", { error: "User does not exist" });
    req.flash("error", "User does not exist");
    return res.redirect("/api/v1/admin/login")
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    // return res.render("admin/auth/login", { error: "Invalid password" });
    req.flash("error", "Invalid password");
    return res.redirect("/api/v1/admin/login")
  }

  req.session.admin = {
    id: admin._id,
    username: admin.username,
  };

  req.flash("success", "Login successful!");
  res.redirect("/api/v1/admin/dashboard");
};


// REGISTER
exports.getRegister = (req, res) => {
  res.render("admin/auth/register");
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await Admin.findOne({ $or: [{ email }, { username }] });

  if (exists) {
    req.flash("error", "User already exist!");
    return res.redirect("/api/v1/admin/register");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("otp : ", otp);

  const admin = new Admin({
    username,
    email,
    password: hashedPassword,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
    isVerified: false,
  });

  await admin.save();

  // req.flash("success", `OTP: ${otp}`);
  if (admin.email) {
    await sendOtpEmail(admin.email, admin.otp);
    console.log(`📧 OTP sent on ${admin.email}`);
  }
  res.redirect(`/api/v1/admin/verify-otp?email=${email}`);
};


// GET OTP
exports.getVerifyOtp = (req, res) => {
  res.render("admin/auth/verify-otp", { email: req.query.email });
};


// VERIFY OTP
exports.postVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email });

  console.log("Admin : ", admin);

  if (!admin || admin.otp !== otp || admin.otpExpiry < Date.now()) {
    // return res.render("admin/auth/verify-otp", {
    //   error: "Invalid or expired OTP",
    //   email,
    // });

    req.flash("error", "Invalid or expired OTP")
    return res.redirect("/api/v1/admin/verify-otp")
  }

  admin.isVerified = true;
  admin.otp = undefined;
  admin.otpExpiry = undefined;

  await admin.save();

  req.flash("success", "User registered successfully!")
  res.redirect("/api/v1/admin/login");
};


// PASSWORD RESET

exports.getForgetPassword = (req, res) => {
  res.render("admin/auth/forgetPassword");
};

exports.postForgetPassword = async (req, res) => {
  const { username, email } = req.body;

  const admin = await Admin.findOne({ $or: [{ email }, { username }] });

  if (!admin) {
    return res.render("admin/auth/forgetPassword", {
      error: "User does not exist",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  admin.otp = otp;
  admin.otpExpiry = Date.now() + 10 * 60 * 1000;

  await admin.save();

  // req.flash("success", `OTP: ${otp}`);
  if (admin.email) {
    await sendOtpEmail(admin.email, admin.otp);
    console.log(`📧 OTP sent on ${admin.email}`);
  }
  res.redirect(`/api/v1/admin/reset-password-verify?email=${admin.email}`);
};

exports.getResetVerifyOtp = (req, res) => {
  res.render("admin/auth/reset-verify-otp", { email: req.query.email });
};

exports.postResetVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin || admin.otp !== otp || admin.otpExpiry < Date.now()) {
    return res.render("admin/auth/reset-verify-otp", {
      error: "Invalid or expired OTP",
      email,
    });
  }

  res.redirect(`/api/v1/admin/new-password?email=${email}`);
};

exports.getNewPassword = (req, res) => {
  res.render("admin/auth/new-password", { email: req.query.email });
};

exports.postNewPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.redirect("/api/v1/admin/forget-password");
  }

  if (password !== confirmPassword) {
    return res.render("admin/auth/new-password", {
      error: "Passwords do not match",
      email,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  admin.password = hashedPassword;
  admin.otp = undefined;
  admin.otpExpiry = undefined;

  await admin.save();

  req.flash("success", "Password reset successful!");
  res.redirect("/api/v1/admin/login");
};

exports.logout = (req, res) => {
  req.flash("success", "Logged out successfully");

  req.session.regenerate((err) => {
    if (err) return res.redirect("/");
    res.redirect("/portal");
  });
};
