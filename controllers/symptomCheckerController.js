const { symptomDatabase, emergencyKeywords } = require("../data/symptomData");
const doctorModel = require("../models/doctorModel");


const analyzeSymptomsController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).send({
        success: false,
        message: "Please describe your symptoms",
      });
    }

    const text = message.toLowerCase();

    // ── 1. emergency check first ──
    const isEmergency = emergencyKeywords.some((kw) => text.includes(kw));
    if (isEmergency) {
      return res.status(200).send({
        success: true,
        emergency: true,
        reply:
          "⚠️ This sounds like a medical emergency. Please call 108 immediately or go to your nearest emergency room. This chatbot cannot help with emergencies.",
      });
    }

    // ── 2. match symptoms against the knowledge base ──
    const matches = symptomDatabase.filter((entry) =>
      entry.keywords.some((kw) => text.includes(kw))
    );

    if (matches.length === 0) {
      return res.status(200).send({
        success: true,
        emergency: false,
        matched: false,
        reply:
          "I couldn't confidently match your symptoms to a specialist. Could you describe them differently? Or you can browse all doctors directly.",
      });
    }

    // ── 3. pick the best (first) match, fetch matching doctors ──
    const topMatch = matches[0];
    const doctors = await doctorModel
      .find({
        status: "approved",
        specialization: { $regex: topMatch.specialization, $options: "i" },
      })
      .limit(4);

    res.status(200).send({
      success: true,
      emergency: false,
      matched: true,
      reply: topMatch.advice,
      specialization: topMatch.specialization,
      urgency: topMatch.urgency,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error analyzing symptoms",
      error,
    });
  }
};

module.exports = { analyzeSymptomsController };