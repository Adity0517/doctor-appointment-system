const doctorModel = require("../models/doctorModel");

/**
 * ════════════════════════════════════════════════════════════
 * FILTER DOCTORS BY SPOKEN LANGUAGE / DIALECT
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/language/filter-doctors
 * body: { language: "Bhojpuri" }
 *
 * Lets a patient find doctors who speak their preferred regional
 * language — useful in a country with huge linguistic diversity,
 * where a patient explaining symptoms in their mother tongue can
 * make a real difference in care quality.
 */
const filterDoctorsByLanguageController = async (req, res) => {
  try {
    const { language } = req.body;

    if (!language) {
      return res.status(400).send({
        success: false,
        message: "Please specify a language",
      });
    }

    const doctors = await doctorModel.find({
      status: "approved",
      languagesSpoken: { $regex: new RegExp(language, "i") },
    });

    res.status(200).send({
      success: true,
      message: `Found ${doctors.length} doctor(s) who speak ${language}`,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error filtering doctors by language",
      error,
    });
  }
};

/**
 * GET LIST OF ALL LANGUAGES CURRENTLY SPOKEN ACROSS DOCTORS
 * GET /api/v1/language/available-languages
 * Used to populate the filter dropdown dynamically (only shows
 * languages doctors actually speak, instead of a hardcoded list).
 */
const getAvailableLanguagesController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" }, "languagesSpoken");
    const languageSet = new Set();
    doctors.forEach((doc) => {
      (doc.languagesSpoken || []).forEach((lang) => languageSet.add(lang));
    });

    res.status(200).send({
      success: true,
      data: Array.from(languageSet).sort(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching available languages",
      error,
    });
  }
};

module.exports = {
  filterDoctorsByLanguageController,
  getAvailableLanguagesController,
};
