const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  generateMeetLinkController,
  getMeetLinkController,
} = require("../controllers/videoConsultation");

const router = express.Router();

// Doctor generates a Meet link for an approved appointment
router.post(
  "/generate-meet-link",
  authMiddleware,
  generateMeetLinkController
);

// Patient or doctor fetches the existing Meet link
router.post(
  "/get-meet-link",
  authMiddleware,
  getMeetLinkController
);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in your main server.js / app.js:

   app.use("/api/v1/video", require("./routes/videoConsultationRoutes"));
   ════════════════════════════════════════════════════ */