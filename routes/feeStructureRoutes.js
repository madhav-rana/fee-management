const express = require("express");
const router = express.Router();

const feeController = require("../controllers/feeStructure.controller");
const wrapAsync = require("../utils/wrapAsync");
const isAdmin = require("../middleware/isAdmin");

// Protect all fee routes
router.use(isAdmin);

// View all fee structures
router.get("/", wrapAsync(feeController.getAllFeeStructures));

// Show form to create new fee structure
// ⚠️ getNewFeeStructureForm has no wrapAsync — correct since it's not async
router.get("/new", feeController.getNewFeeStructureForm);

// Create new fee structure
router.post("/", wrapAsync(feeController.createFeeStructure));

// View single fee structure
router.get("/:id", wrapAsync(feeController.getFeeStructureById));

// Show edit form
router.get("/:id/edit", wrapAsync(feeController.getEditFeeStructureForm));

// Update fee structure
router.put("/:id", wrapAsync(feeController.updateFeeStructure));

// Delete fee structure
// router.delete("/:id", wrapAsync(feeController.deleteFeeStructure));

module.exports = router;