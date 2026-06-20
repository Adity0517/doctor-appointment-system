const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const connectDB = require("./config/db");
require("./utils/reminderService");
//dotenv conig


//mongodb connection
connectDB();

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));
app.use("/uploads",express.static("uploads"));
//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/video", require("./routes/videoconsultationRoutes"));
app.use("/api/v1/symptom-checker", require("./routes/symptomCheckerRoutes"));
app.use("/api/v1/location", require("./routes/locationRoutes"));
app.use("/api/v1/queue", require("./routes/queueRoutes"));
//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});