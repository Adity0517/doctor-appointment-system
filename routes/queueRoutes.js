const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getQueueStatusController,
  getDoctorQueueController,
} = require("../controllers/queueController");

const router = express.Router();

// Patient checks their own token/queue status
router.post("/status", authMiddleware, getQueueStatusController);

// Doctor views their full queue for a given date
router.post("/doctor-queue", authMiddleware, getDoctorQueueController);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in server.js, alongside your other routes:

   app.use("/api/v1/queue", require("./routes/queueRoutes"));
   ════════════════════════════════════════════════════ */
