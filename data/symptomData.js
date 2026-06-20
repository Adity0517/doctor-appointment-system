
const symptomDatabase = [
  {
    keywords: ["chest pain", "heart", "palpitation", "high blood pressure", "bp", "breathless", "shortness of breath"],
    specialization: "Cardiologist",
    advice: "Your symptoms may be related to your heart or blood pressure. A Cardiologist can help diagnose this properly.",
    urgency: "high",
  },
  {
    keywords: ["fever", "cold", "cough", "headache", "body ache", "weakness", "flu", "sore throat"],
    specialization: "General Physician",
    advice: "These sound like common symptoms a General Physician can evaluate first.",
    urgency: "low",
  },
  {
    keywords: ["skin", "rash", "acne", "itching", "allergy", "pimple", "eczema"],
    specialization: "Dermatologist",
    advice: "Skin-related concerns are best handled by a Dermatologist.",
    urgency: "low",
  },
  {
    keywords: ["bone", "joint pain", "fracture", "back pain", "knee pain", "sprain", "arthritis"],
    specialization: "Orthopedic",
    advice: "Bone, joint, or muscle issues should be checked by an Orthopedic specialist.",
    urgency: "medium",
  },
  {
    keywords: ["headache", "migraine", "dizziness", "seizure", "numbness", "memory loss", "tremor"],
    specialization: "Neurologist",
    advice: "Symptoms involving the brain or nervous system need a Neurologist's evaluation.",
    urgency: "medium",
  },
  {
    keywords: ["child", "baby", "infant", "kid fever", "vaccination", "newborn"],
    specialization: "Pediatrician",
    advice: "For children's health concerns, a Pediatrician is the right specialist.",
    urgency: "medium",
  },
  {
    keywords: ["pregnancy", "periods", "menstrual", "pcod", "pcos", "gynecology"],
    specialization: "Gynecologist",
    advice: "This falls under women's health — a Gynecologist can assist you best.",
    urgency: "medium",
  },
  {
    keywords: ["eye", "vision", "blurry", "eyesight", "red eye", "eye pain"],
    specialization: "Ophthalmologist",
    advice: "Eye and vision concerns should be checked by an Ophthalmologist.",
    urgency: "low",
  },
  {
    keywords: ["anxiety", "depression", "stress", "panic", "insomnia", "sleep problem", "mental health"],
    specialization: "Psychiatrist",
    advice: "Your mental wellbeing matters — a Psychiatrist can provide proper support.",
    urgency: "medium",
  },
  {
    keywords: ["stomach", "vomiting", "diarrhea", "acidity", "digestion", "abdominal pain", "nausea"],
    specialization: "Gastroenterologist",
    advice: "Digestive issues are best evaluated by a Gastroenterologist.",
    urgency: "medium",
  },
];

/**
 * Emergency keywords — if found, the bot stops giving suggestions
 * and tells the patient to seek emergency care immediately.
 */
const emergencyKeywords = [
  "severe chest pain",
  "can't breathe",
  "cannot breathe",
  "unconscious",
  "heavy bleeding",
  "suicidal",
  "stroke",
  "heart attack",
];

module.exports = { symptomDatabase, emergencyKeywords };