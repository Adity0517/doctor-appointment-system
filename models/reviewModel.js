const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "doctors",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "appointments",
    },
    patientName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// A patient can only review the SAME appointment once
reviewSchema.index({ appointmentId: 1 }, { unique: true });

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;
