const reviewModel = require("../models/reviewModel");
const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");

/**
 * ════════════════════════════════════════════════════════════
 * SUBMIT A REVIEW
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/review/submit
 * body: { appointmentId, doctorId, rating, comment }
 * (userId comes from req.body too, set by the frontend like your
 *  other controllers — or swap to req.user if you have that set up)
 */
const submitReviewController = async (req, res) => {
  try {
    const { appointmentId, doctorId, userId, patientName, rating, comment } = req.body;

    if (!appointmentId || !doctorId || !userId || !rating) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).send({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // only allow reviewing an approved appointment
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }
    if (appointment.status !== "approved") {
      return res.status(400).send({
        success: false,
        message: "You can only review approved appointments",
      });
    }

    // prevent duplicate reviews for the same appointment
    const existing = await reviewModel.findOne({ appointmentId });
    if (existing) {
      return res.status(400).send({
        success: false,
        message: "You have already reviewed this appointment",
      });
    }

    const newReview = new reviewModel({
      doctorId,
      userId,
      appointmentId,
      patientName,
      rating,
      comment,
    });
    await newReview.save();

    res.status(201).send({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    // unique index violation (duplicate appointmentId) lands here too
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: "You have already reviewed this appointment",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error submitting review",
      error,
    });
  }
};

/**
 * ════════════════════════════════════════════════════════════
 * GET ALL REVIEWS FOR A DOCTOR (+ average rating)
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/review/doctor-reviews
 * body: { doctorId }
 */
const getDoctorReviewsController = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const reviews = await reviewModel
      .find({ doctorId })
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

    res.status(200).send({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        totalReviews,
        averageRating: Number(averageRating),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching reviews",
      error,
    });
  }
};

/**
 * ════════════════════════════════════════════════════════════
 * CHECK IF A SPECIFIC APPOINTMENT HAS ALREADY BEEN REVIEWED
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/review/check
 * body: { appointmentId }
 * Used by the frontend to decide: show "Give Review" or "✓ Reviewed"
 */
const checkReviewController = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const review = await reviewModel.findOne({ appointmentId });

    res.status(200).send({
      success: true,
      reviewed: !!review,
      data: review || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error checking review status",
      error,
    });
  }
};

module.exports = {
  submitReviewController,
  getDoctorReviewsController,
  checkReviewController,
};
