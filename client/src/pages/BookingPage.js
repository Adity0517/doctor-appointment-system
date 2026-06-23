import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import DoctorRatingSummary from "../components/DoctorRatingSummary";
import "./BookingPage.css";
import PayAndBookButton from "../components/PayAndBookButton";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  /* ── fetch doctor by id ── */
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* ── check availability ── */
  const handleAvailability = async () => {
    if (!date || !time) {
      return message.warning("Please select date & time first");
    }
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  /* ── book appointment ── */

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      {/* ── banner ── */}
      <div className="bp-banner">
        <h1 className="bp-banner__title">🏥 Healthcare Appointment Portal</h1>
        <p className="bp-banner__sub">
          Book trusted doctors in seconds and manage your appointments easily.
        </p>
      </div>

      <h2 className="bp-page-title">📅 Book Your Appointment</h2>

      {doctors && (
        <div className="bp-container">

          {/* ── LEFT: doctor info ── */}
          <div className="bp-left">
            <div className="bp-doctor-card">
              <div className="bp-doctor-card__badge">⭐ Top Rated Doctor</div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                alt="doctor"
                className="bp-doctor-card__img"
              />
              <h3 className="bp-doctor-card__name">
                Dr. {doctors.firstName} {doctors.lastName}
              </h3>
              <p className="bp-doctor-card__spec">🩺 {doctors.specialization}</p>

              <div className="bp-doctor-card__row">
                <span>💰 Consultation Fee</span>
                <strong>₹{doctors.feesPerCunsaltation}</strong>
              </div>
              <div className="bp-doctor-card__row">
                <span>🕒 Available</span>
                <strong>
                  {doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}
                </strong>
              </div>
            </div>

            <div className="bp-info-card">
              <h5>📌 Appointment Information</h5>
              <ul>
                <li>✅ Doctor approval required</li>
                <li>📧 Notification will be sent instantly</li>
                <li>🕒 Choose a slot within doctor's timings</li>
                <li>🏥 Online &amp; Offline consultation supported</li>
              </ul>
            </div>
          </div>
          <DoctorRatingSummary doctorId={params.doctorId} />

          {/* ── RIGHT: booking form ── */}
          <div className="bp-right">
            <div className="bp-form">
              <h4 className="bp-form__title">Select Date &amp; Time</h4>

              <div className="bp-form__row">
                <label>Appointment Date</label>
                <DatePicker
                  className="bp-input"
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(value ? moment(value).format("DD-MM-YYYY") : "");
                    setIsAvailable(false);
                  }}
                />
              </div>

              <div className="bp-form__row">
                <label>Appointment Time</label>
                <TimePicker
                  className="bp-input"
                  format="HH:mm"
                  onChange={(value) => {
                    setTime(value ? moment(value).format("HH:mm") : "");
                    setIsAvailable(false);
                  }}
                />
              </div>

              {date && time && (
                <div className="bp-summary">
                  <h4>📋 Appointment Summary</h4>
                  <div className="bp-summary__row">
                    <span>Doctor</span>
                    <strong>Dr. {doctors.firstName} {doctors.lastName}</strong>
                  </div>
                  <div className="bp-summary__row">
                    <span>Date</span>
                    <strong>{date}</strong>
                  </div>
                  <div className="bp-summary__row">
                    <span>Time</span>
                    <strong>{time}</strong>
                  </div>
                  <div className="bp-summary__row">
                    <span>Consultation Fee</span>
                    <strong>₹{doctors.feesPerCunsaltation}</strong>
                  </div>
                  <div className={`bp-status-badge ${isAvailable ? "bp-status-badge--available" : "bp-status-badge--pending"}`}>
                    {isAvailable ? "🟢 Slot Available" : "🟡 Check Availability"}
                  </div>
                </div>
              )}

              <div className="bp-btn-row">
                <button className="bp-btn bp-btn--outline" onClick={handleAvailability}>
                  Check Availability
                </button>
                <PayAndBookButton
  doctors={doctors}
  doctorId={params.doctorId}
  date={date}
  time={time}
/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── floating support ── */}
      <div
        className="bp-support-btn"
        onClick={() => message.info("Customer Support Coming Soon!")}
        title="Need help?"
      >
        💬
      </div>
    </Layout>
  );
};

export default BookingPage;