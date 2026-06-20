 import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="wl-container">
      <div className="wl-bg-circle wl-bg-circle--1" />
      <div className="wl-bg-circle wl-bg-circle--2" />

      <div className="wl-content">
        <div className="wl-badge">
          <span className="wl-pulse-dot" />
          Trusted by 1,200+ Doctors
        </div>

        <div className="wl-logo">🩺</div>

        <h1 className="wl-title">
          🏥 Medi<span className="wl-title__accent">Care</span> Connect
        </h1>

        <p className="wl-subtitle">Smart Doctor Appointment Platform</p>

        <div className="wl-features">
          <span className="wl-feature">✓ Online Booking</span>
          <span className="wl-feature">✓ Verified Doctors</span>
          <span className="wl-feature">✓ Instant Appointments</span>
        </div>

        <button className="wl-start-btn" onClick={() => navigate("/login")}>
          Get Started →
        </button>

        <p className="wl-footer-note">
          Already have an account?{" "}
          <span className="wl-link" onClick={() => navigate("/login")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;