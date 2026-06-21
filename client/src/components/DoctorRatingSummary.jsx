import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorRatingSummary.css";

/**
 * Shows average rating + review count + list of reviews for a doctor.
 *
 * USAGE — inside BookingPage.jsx, drop it near the doctor info card:
 *   import DoctorRatingSummary from "../components/DoctorRatingSummary";
 *   ...
 *   <DoctorRatingSummary doctorId={params.doctorId} />
 *
 * USAGE — compact version on DoctorList.jsx card (just the stars):
 *   <DoctorRatingSummary doctorId={doctor._id} compact />
 */
const DoctorRatingSummary = ({ doctorId, compact = false }) => {
  const [data, setData] = useState({ reviews: [], totalReviews: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.post("/api/v1/review/doctor-reviews", { doctorId });
        if (res.data.success) setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchReviews();
  }, [doctorId]);

  if (loading) return null;

  /* ── compact: just stars + count, for doctor cards ── */
  if (compact) {
    if (data.totalReviews === 0) {
      return <span className="drs-compact-empty">No reviews yet</span>;
    }
    return (
      <span className="drs-compact">
        ⭐ {data.averageRating} <span className="drs-compact-count">({data.totalReviews})</span>
      </span>
    );
  }

  /* ── full: summary + review list, for booking/profile page ── */
  return (
    <div className="drs-card">
      <div className="drs-summary">
        <div className="drs-summary__score">{data.averageRating || "—"}</div>
        <div>
          <div className="drs-summary__stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`drs-star ${s <= Math.round(data.averageRating) ? "drs-star--filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="drs-summary__count">
            Based on {data.totalReviews} review{data.totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {data.reviews.length === 0 ? (
        <p className="drs-empty">No reviews yet. Be the first to review this doctor!</p>
      ) : (
        <div className="drs-list">
          {data.reviews.map((r) => (
            <div key={r._id} className="drs-review">
              <div className="drs-review__header">
                <span className="drs-review__name">{r.patientName}</span>
                <span className="drs-review__stars">
                  {"★".repeat(r.rating)}
                  <span className="drs-review__stars--empty">{"★".repeat(5 - r.rating)}</span>
                </span>
              </div>
              {r.comment && <p className="drs-review__comment">{r.comment}</p>}
              <p className="drs-review__date">
                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorRatingSummary;
