// studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const wrapAsync = require("../utils/wrapAsync"); // 🆕

router.get("/", studentController.getSearchPage); // no wrapAsync needed — no async
router.get("/search", wrapAsync(studentController.searchStudent)); // 🆕 wrapAsync

module.exports = router;