const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  submitReviewController,
  getDoctorReviewsController,
  checkReviewController,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/submit", authMiddleware, submitReviewController);
router.post("/doctor-reviews", getDoctorReviewsController); // public — visible to anyone browsing doctors
router.post("/check", authMiddleware, checkReviewController);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in server.js, alongside your other routes:

   app.use("/api/v1/review", require("./routes/reviewRoutes"));
   ════════════════════════════════════════════════════ */
