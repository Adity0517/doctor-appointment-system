const doctorModel = require("../models/doctorModel");

/**
 * ════════════════════════════════════════════════════════════
 * LOCATION-BASED DOCTOR SUGGESTION
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/location/nearby-doctors
 * body: { city: "Mumbai" }
 *
 * Simple text-match approach (no GPS/maps API needed):
 * matches the patient's city/area against each doctor's `address`
 * field. Doctors whose address contains the city come first,
 * everyone else follows after — so the patient always sees ALL
 * doctors, just sorted by relevance to their location.
 * ════════════════════════════════════════════════════════════
 */
const getNearbyDoctorsController = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city || !city.trim()) {
      return res.status(400).send({
        success: false,
        message: "Please provide a city or area",
      });
    }

    const cityRegex = new RegExp(city.trim(), "i"); // case-insensitive partial match

    // doctors whose address matches the city
    const matchedDoctors = await doctorModel.find({
      status: "approved",
      address: { $regex: cityRegex },
    });

    // all other approved doctors (not matching) — shown after, as fallback
    const matchedIds = matchedDoctors.map((d) => d._id);
    const otherDoctors = await doctorModel.find({
      status: "approved",
      _id: { $nin: matchedIds },
    });

    res.status(200).send({
      success: true,
      message:
        matchedDoctors.length > 0
          ? `Found ${matchedDoctors.length} doctor(s) near "${city}"`
          : `No doctors found in "${city}" — showing all available doctors instead`,
      matchedCount: matchedDoctors.length,
      data: {
        nearby: matchedDoctors,
        others: otherDoctors,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error finding nearby doctors",
      error,
    });
  }
};

module.exports = { getNearbyDoctorsController };
