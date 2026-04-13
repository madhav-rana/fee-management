const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const wrapAsync = require("../utils/wrapAsync");

// --- View Routes ---
router.get("/new", wrapAsync(paymentController.renderPaymentPage));
router.get("/receipt/:paymentId", wrapAsync(paymentController.getReceipt));
router.get("/receipt/:id/pdf", wrapAsync(paymentController.getReceiptPDF));

// --- API / Logic Routes ---
router.post("/create-order", wrapAsync(paymentController.createOrder));
router.post("/", wrapAsync(paymentController.savePayment));

module.exports = router;