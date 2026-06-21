import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, message } from "antd";
import { useSelector } from "react-redux";
import "./ReviewButton.css";

/**
 * USAGE — inside Appointments.jsx (patient side), replace the
 * existing static "Give Review" button with this component:
 *
 *   import ReviewButton from "../components/ReviewButton";
 *   ...
 *   {
 *     title: "Review",
 *     render: (text, record) =>
 *       record.status === "approved" ? (
 *         <ReviewButton appointment={record} />
 *       ) : (
 *         <span className="ap-review-disabled">—</span>
 *       ),
 *   },
 */
const ReviewButton = ({ appointment }) => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [checking, setChecking] = useState(true);

  /* ── check if this appointment was already reviewed ── */
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.post(
          "/api/v1/review/check",
          { appointmentId: appointment._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (res.data.success) setAlreadyReviewed(res.data.reviewed);
      } catch (error) {
        console.log(error);
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
    // eslint-disable-next-line
  }, [appointment._id]);

  /* ── submit review ── */
  const handleSubmit = async () => {
    if (rating === 0) {
      message.warning("Please select a star rating");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post(
        "/api/v1/review/submit",
        {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId,
          userId: user._id,
          patientName: user.name,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSubmitting(false);
      if (res.data.success) {
        message.success("Thank you for your review!");
        setAlreadyReviewed(true);
        setOpen(false);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      setSubmitting(false);
      console.log(error);
      message.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (checking) return <span className="rb-checking">...</span>;

  if (alreadyReviewed) {
    return <span className="rb-done">✓ Reviewed</span>;
  }

  return (
    <>
      <button className="rb-btn" onClick={() => setOpen(true)}>
        ⭐ Give Review
      </button>

      <Modal
        title={`Rate Dr. ${appointment.doctorInfo?.firstName} ${appointment.doctorInfo?.lastName}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="rb-modal"
      >
        <div className="rb-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`rb-star ${star <= (hoverRating || rating) ? "rb-star--filled" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
        <p className="rb-rating-label">
          {rating === 0 && "Tap a star to rate"}
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent"}
        </p>

        <textarea
          className="rb-textarea"
          placeholder="Share your experience (optional)..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="rb-submit-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </Modal>
    </>
  );
};

export default ReviewButton;
