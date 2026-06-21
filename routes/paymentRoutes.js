const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrderController,
  verifyPaymentController,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", authMiddleware, createOrderController);
router.post("/verify", authMiddleware, verifyPaymentController);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in server.js, alongside your other routes:

   app.use("/api/v1/payment", require("./routes/paymentRoutes"));
   ════════════════════════════════════════════════════ */
