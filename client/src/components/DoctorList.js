import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import "./Doctorlist.css";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();

  /* ── view details modal ── */
  const showDoctorDetails = () => {
    Modal.info({
      title: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      width: 480,
      className: "dl-modal",
      content: (
        <div className="dl-modal__body">
          <div className="dl-modal__row">
            <span className="dl-modal__label">Specialization</span>
            <span className="dl-modal__value">{doctor.specialization}</span>
          </div>
          <div className="dl-modal__row">
            <span className="dl-modal__label">Experience</span>
            <span className="dl-modal__value">{doctor.experience} Years</span>
          </div>
          <div className="dl-modal__row">
            <span className="dl-modal__label">Consultation Fee</span>
            <span className="dl-modal__value">₹{doctor.feesPerCunsaltation}</span>
          </div>
          <div className="dl-modal__row">
            <span className="dl-modal__label">Timings</span>
            <span className="dl-modal__value">
              {doctor.timings[0]} - {doctor.timings[1]}
            </span>
          </div>
          {doctor.consultationType && (
            <div className="dl-modal__row">
              <span className="dl-modal__label">Consultation Type</span>
              <span className="dl-modal__value">{doctor.consultationType}</span>
            </div>
          )}
        </div>
      ),
    });
  };

  const isSenior = doctor.experience > 10;

  return (
    <div
      className="dl-card"
      onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
    >
      {/* ── image + badges ── */}
      <div className="dl-card__media">
        <img
          src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
          alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
          className="dl-card__img"
        />
        <span className="dl-badge dl-badge--available">🟢 Available Today</span>
        <span className={`dl-badge dl-badge--rank ${isSenior ? "dl-badge--senior" : "dl-badge--consultant"}`}>
          {isSenior ? "🏆 Senior Specialist" : "⭐ Consultant"}
        </span>
      </div>

      {/* ── header ── */}
      <div className="dl-card__header">
        <h5 className="dl-card__name">
          Dr. {doctor.firstName} {doctor.lastName}
        </h5>
        <div className="dl-card__rating">
          <span>⭐ 4.8/5</span>
          <span className="dl-card__reviews">125 reviews</span>
        </div>
      </div>

      {/* ── body / info rows ── */}
      <div className="dl-card__body">
        <div className="dl-info-row">
          <span className="dl-info-row__icon">🩺</span>
          <span>{doctor.specialization}</span>
        </div>
        <div className="dl-info-row">
          <span className="dl-info-row__icon">📈</span>
          <span>{doctor.experience} Years Experience</span>
        </div>
        <div className="dl-info-row">
          <span className="dl-info-row__icon">🕒</span>
          <span>{doctor.timings[0]} - {doctor.timings[1]}</span>
        </div>
        {doctor.consultationType && (
          <div className="dl-info-row">
            <span className="dl-info-row__icon">🎥</span>
            <span>{doctor.consultationType}</span>
          </div>
        )}
      </div>

      {/* ── fee + actions ── */}
      <div className="dl-card__footer">
        <div className="dl-card__fee">
          <span className="dl-card__fee-label">Consultation Fee</span>
          <span className="dl-card__fee-amount">₹{doctor.feesPerCunsaltation}</span>
        </div>
        <div className="dl-card__btns">
          <button
            className="dl-btn dl-btn--outline"
            onClick={(e) => {
              e.stopPropagation();
              showDoctorDetails();
            }}
          >
            View Details
          </button>
          <button
            className="dl-btn dl-btn--solid"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/doctor/book-appointment/${doctor._id}`);
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;