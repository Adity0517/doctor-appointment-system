const express = require("express");
const { analyzeSymptomsController } = require("../controllers/symptomCheckerController");

const router = express.Router();

// No auth required — chatbot should work even for non-logged-in visitors
router.post("/analyze", analyzeSymptomsController);

module.exports = router;