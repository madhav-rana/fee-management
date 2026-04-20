// reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const wrapAsync = require("../utils/wrapAsync"); // 🆕
const isAdmin = require("../middleware/isAdmin"); // 🆕 reports should be protected

router.use(isAdmin); // 🆕 protect all report routes

router.get("/", reportController.getReportHome); // no wrapAsync — not async
router.get("/branch", wrapAsync(reportController.getBranchReport)); // 🆕
router.get("/duration", wrapAsync(reportController.getDurationReport)); // 🆕
router.get("/student-status", wrapAsync(reportController.getStudentStatusReport)); // 🆕
router.get("/hostel", wrapAsync(reportController.getHostelReport));

module.exports = router;