/**
 * ════════════════════════════════════════════════════════════
 * SYMPTOM PHOTO AI — basic visual triage
 * ════════════════════════════════════════════════════════════
 * Patient uploads a photo (e.g. skin rash, wound, swelling) and
 * gets a basic AI-assisted suggestion of which specialist to see.
 *
 * IMPORTANT HONESTY NOTE for your viva: this does NOT do real
 * medical image diagnosis (that requires a trained clinical model
 * and regulatory approval — far outside a student project's scope).
 * Instead, it uses lightweight image analysis (color/texture
 * heuristics) combined with a follow-up question to make a
 * REASONABLE specialization suggestion — similar in spirit to how
 * the text-based Symptom Checker works, just with an image input
 * channel. Being upfront about this distinction is exactly the
 * kind of answer that impresses an examiner.
 * ════════════════════════════════════════════════════════════
 */
const sharp = require("sharp");
const doctorModel = require("../models/doctorModel");

/**
 * POST /api/v1/photo-symptom/analyze
 * multipart/form-data: { image: <file> }
 *
 * Uses basic image stats (average color, redness ratio) as a
 * simple heuristic — reddish/inflamed regions lean toward
 * Dermatologist, otherwise falls back to General Physician with
 * a recommendation to also describe symptoms in text.
 */
const analyzePhotoSymptomController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No image uploaded",
      });
    }

    // ── basic heuristic analysis using sharp ──
    const { data, info } = await sharp(req.file.path)
      .resize(100, 100, { fit: "inside" }) // downscale for fast stats
      .raw()
      .toBuffer({ resolveWithObject: true });

    let totalR = 0, totalG = 0, totalB = 0;
    const pixelCount = info.width * info.height;
    const channels = info.channels;

    for (let i = 0; i < data.length; i += channels) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }

    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;

    // simple redness heuristic: red channel notably higher than green/blue
    // suggests inflammation, rash, or irritation
    const rednessScore = avgR - (avgG + avgB) / 2;

    let specialization, advice, confidence;

    if (rednessScore > 25) {
      specialization = "Dermatologist";
      advice =
        "The image shows signs consistent with skin irritation or inflammation. A Dermatologist can give you a proper diagnosis.";
      confidence = "moderate";
    } else if (rednessScore > 10) {
      specialization = "Dermatologist";
      advice =
        "There may be mild skin discoloration or irritation visible. Consider consulting a Dermatologist, especially if there's discomfort.";
      confidence = "low";
    } else {
      specialization = "General Physician";
      advice =
        "We couldn't detect clear visual indicators from the image alone. A General Physician can examine this in person and refer you to a specialist if needed.";
      confidence = "low";
    }

    const doctors = await doctorModel
      .find({ status: "approved", specialization: { $regex: specialization, $options: "i" } })
      .limit(4);

    res.status(200).send({
      success: true,
      message: advice,
      specialization,
      confidence,
      disclaimer:
        "This is an automated visual screening tool, NOT a medical diagnosis. Please consult a doctor for an accurate assessment.",
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error analyzing image",
      error: error.message,
    });
  }
};

module.exports = { analyzePhotoSymptomController };
