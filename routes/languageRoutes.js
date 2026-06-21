const express = require("express");
const {
  filterDoctorsByLanguageController,
  getAvailableLanguagesController,
} = require("../controllers/languageController");

const router = express.Router();

router.post("/filter-doctors", filterDoctorsByLanguageController);
router.get("/available-languages", getAvailableLanguagesController);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in server.js, alongside your other routes:

   app.use("/api/v1/language", require("./routes/languageRoutes"));
   ════════════════════════════════════════════════════ */
