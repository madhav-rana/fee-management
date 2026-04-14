// paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const wrapAsync = require("../utils/wrapAsync"); // 🆕

router.get("/new", wrapAsync(paymentController.renderPaymentPage)); // 🆕 wrapAsync
router.post("/", wrapAsync(paymentController.savePayment)); // 🆕 wrapAsync
router.get("/receipt/:paymentId", wrapAsync(paymentController.getReceipt)); // 🆕 wrapAsync
router.get("/receipt/:id/pdf", wrapAsync(paymentController.getReceiptPDF)); // 🆕 wrapAsync

router.post("/create-order", wrapAsync(paymentController.createOrder));



module.exports = router;