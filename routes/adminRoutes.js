const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authController = require("../controllers/auth.controller");
const isAdmin = require("../middleware/isAdmin");
const studentController = require("../controllers/student.controller")

const wrapAsync = require("../utils/wrapAsync.js");

// console.log("adminController:", adminController);
// console.log("postRegister:", authController.postRegister);

// AUTH
router.get("/login", authController.getLogin);
router.post("/login", wrapAsync(authController.postLogin));

router.get("/register", authController.getRegister);
router.post("/register", wrapAsync(authController.postRegister));

router.get("/verify-otp", authController.getVerifyOtp);
router.post("/verify-otp", wrapAsync(authController.postVerifyOtp));

router.get("/forget-password", authController.getForgetPassword);
router.post("/forget-password", wrapAsync(authController.postForgetPassword));

router.get("/reset-password-verify", authController.getResetVerifyOtp);
router.post("/reset-password-verify", wrapAsync(authController.postResetVerifyOtp));

router.get("/new-password", authController.getNewPassword);
router.post("/new-password", wrapAsync(authController.postNewPassword));

// PROTECTED
router.use(isAdmin);

router.get("/dashboard", wrapAsync(adminController.getDashboard));

// router.get("/branch-analysis/:branchId", adminController.getBranchAnalysis);

router.get("/students", adminController.getStudentSearchPage);
router.get("/students/search", wrapAsync(adminController.searchStudent));

// toggle hostel
router.post("/students/toggle-hostel/:id", wrapAsync(adminController.toggleHostel));

// Show form  to add new student
router.get("/students/add", wrapAsync(adminController.getAddStudentPage));

// Add single student
router.post("/students/add", wrapAsync(adminController.addStudent));

// Bulk upload
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/students/bulk",
  upload.single("file"),
  adminController.bulkUploadStudents // no wrapAsync —> intentional
);
// bulkUploadStudents still has no wrapAsync
// because it uses streams — wrapAsync won't catch stream errors
// stream errors must be handled inside the function itself (already done above)


// Show all payments
router.get("/payments", wrapAsync(adminController.getAllPayments));

// logout
router.get("/logout", authController.logout);

// // ================= STUDENT EDIT/UPDATE ROUTES =================

// 1. Edit form dikhane ke liye (GET)
// Path: /api/v1/admin/students/:id/edit
router.get("/students/:id/edit", wrapAsync(adminController.renderEditForm));

// 2. Data update karne ke liye (POST) 
router.post("/students/:id", wrapAsync(adminController.updateStudent));


// Student ki details dikhane ke liye GET route
// router.get("/students/:id", wrapAsync(adminController.searchStudent)); 
// Note: Agar adminController.searchStudent sirf search query leta hai, 
// toh aapko ek naya function 'getStudentDetails' banana pad sakta hai.

module.exports = router;