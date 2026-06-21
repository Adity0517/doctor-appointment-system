const express = require("express");
const multer = require("multer");
const path = require("path");
const { analyzePhotoSymptomController } = require("../controllers/photoSymptomController");

const router = express.Router();

// reuse the same uploads folder pattern your project likely already
// has for prescriptions — adjust destination if yours differs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, `symptom_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/analyze", upload.single("image"), analyzePhotoSymptomController);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in server.js, alongside your other routes:

   app.use("/api/v1/photo-symptom", require("./routes/photoSymptomRoutes"));

   Make sure "uploads/" folder exists at your project root
   (you likely already have this for prescription uploads).
   ════════════════════════════════════════════════════ */
