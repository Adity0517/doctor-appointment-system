const express = require("express");
const { getNearbyDoctorsController } = require("../controllers/locationController");

const router = express.Router();

// No auth needed — works for visitors browsing doctors too
router.post("/nearby-doctors", getNearbyDoctorsController);

module.exports = router;

/* ════════════════════════════════════════════════════
   Add this in your server.js, alongside your other routes:

   app.use("/api/v1/location", require("./routes/locationRoutes"));
   ════════════════════════════════════════════════════ */
