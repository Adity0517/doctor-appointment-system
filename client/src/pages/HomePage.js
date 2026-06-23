import  React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import NearbyDoctors from "../components/NearbyDoctors";
import LanguageFilter from "../components/LanguageFilter";
import PhotoSymptomChecker from "../components/PhotoSymptomChecker";

const SERVICES = [
  { icon: "🩺", title: "Expert Doctors",  desc: "Consult verified, experienced specialists",  action: null },
  { icon: "📅", title: "Easy Booking",    desc: "Book appointments in a few clicks",           action: null },
  { icon: "⚖️", title: "BMI Calculator", desc: "Check your Body Mass Index instantly",        action: "/bmi" },
  { icon: "🔒", title: "Secure Records",  desc: "Your health data stays private",              action: null },
];

const STATS = [
  { key: "dynamic", label: "Total Doctors" },
  { key: "500+",    label: "Patients Served" },
  { key: "99%",     label: "Success Rate" },
  { key: "24/7",    label: "Support" },
  { key: "100%",    label: "Secure" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch]   = useState("");

  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getUserData(); }, []);

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToDoctors = () =>
    document.getElementById("doctors-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Layout>

      {/* ══ 1. HERO ══ */}
      <section className="hp-hero">
        <div className="hp-hero__left">
          <span className="hp-hero__badge">
            <span className="hp-pulse-dot" />
            Live Appointments Available
          </span>
          <h1 className="hp-hero__title">
            Find the Right Doctor,{" "}
            <span className="hp-hero__accent">Book Instantly</span>
          </h1>
          <p className="hp-hero__sub">
            Trusted healthcare professionals at your fingertips. Real-time
            slots, verified doctors, seamless booking — all in one place.
          </p>
          <div className="hp-hero__btns">
            <button className="hp-btn-primary" onClick={scrollToDoctors}>
              Book Appointment
            </button>
            <button className="hp-btn-outline" onClick={() => alert("Emergency Number: 108")}>
              🚑 Emergency: 108
            </button>
          </div>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png"
          alt="doctor illustration"
          className="hp-hero__img"
        />
      </section>

      {/* ══ 2. STATS BAR ══ */}
      <div className="hp-stats-bar">
        {STATS.map((s, i) => (
          <div className="hp-stat-item" key={i}>
            <div className="hp-stat-num">
              {s.key === "dynamic" ? `${doctors.length}+` : s.key}
            </div>
            <div className="hp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══ 3. HEALTH TICKER ══ */}
     
<div className="hp-ticker">
  <div className="hp-ticker__inner">
    🥗 Eat Healthy &nbsp;•&nbsp; 💧 Drink 8 Glasses of Water Daily
    &nbsp;•&nbsp; 🏃 Exercise 30 Minutes &nbsp;•&nbsp; 😴 Sleep 7–8 Hours
    &nbsp;•&nbsp; ❤️ Regular Checkups Save Lives &nbsp;•&nbsp; 🚭 Avoid
    Smoking &nbsp;•&nbsp; 🧘 Manage Stress with Meditation
  </div>
</div>
      {/* ══ 4. SMART TOOLS — Photo Checker + Nearby Doctors ══ */}
      <section className="hp-tools-section">
        <div className="hp-tools-heading">
          <h2>Smart Health Tools</h2>
          <p>AI-powered features to help you find the right care</p>
        </div>
        <div className="hp-tools-grid">
          <div className="hp-tool-card">
            <PhotoSymptomChecker />
          </div>
          <div className="hp-tool-card">
            <NearbyDoctors />
          </div>
        </div>
      </section>

      {/* ══ 5. LANGUAGE FILTER ══ */}
      <section className="hp-lang-section">
        <LanguageFilter />
      </section>

      {/* ══ 6. SEARCH + DOCTOR LIST ══ */}
      <section className="hp-search-section" id="doctors-section">
        <div className="hp-search-header">
          <h2 className="hp-section-title">Available Doctors</h2>
          <p className="hp-search-count">
            Showing {filteredDoctors.length} doctor
            {filteredDoctors.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="hp-search-wrap">
          <span className="hp-search-icon">🔍</span>
          <input
            className="hp-search-input"
            placeholder="Search by doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="hp-doctors-wrap">
        {filteredDoctors.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredDoctors.map((doctor) => (
              <DoctorList key={doctor._id} doctor={doctor} />
            ))}
          </Row>
        ) : (
          <div className="hp-no-results">
            <div className="hp-no-results__icon">🔍</div>
            <p className="hp-no-results__title">No doctors found for "{search}"</p>
            <p className="hp-no-results__sub">Try a different name or clear the search</p>
          </div>
        )}
      </div>

      {/* ══ 7. EMERGENCY BANNER ══ */}
      <div className="hp-emergency-banner">
        <div className="hp-emergency__left">
          <span className="hp-emergency__icon">🚑</span>
          <div>
            <p className="hp-emergency__title">24×7 Emergency Support</p>
            <p className="hp-emergency__sub">
              Need urgent help? Emergency doctors are available round the clock.
            </p>
          </div>
        </div>
        <button className="hp-emergency__btn" onClick={() => alert("Emergency Number: 108")}>
          Call 108
        </button>
      </div>

      {/* ══ 8. SERVICES ══ */}
      <section className="hp-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title">Our Services</h2>
          <p className="hp-section-sub">Everything you need for your health journey</p>
        </div>
        <div className="hp-services-grid">
          {SERVICES.map((svc, i) => (
            <div
              key={i}
              className="hp-service-card"
              onClick={() => svc.action && navigate(svc.action)}
            >
              <div className="hp-service-card__icon">{svc.icon}</div>
              <h4 className="hp-service-card__title">{svc.title}</h4>
              <p className="hp-service-card__desc">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 9. FOOTER ══ */}
      <footer className="hp-footer">
        © 2026 HealthCare+ &nbsp;|&nbsp; Doctor Appointment System &nbsp;|&nbsp;
        <span className="hp-footer__accent">Made with ❤️ for better healthcare</span>
      </footer>

      {/* ══ FLOATING HELP ══ */}
      <button
        className="hp-help-btn"
        onClick={() => alert("Customer Support Coming Soon")}
        title="Help & Support"
      >
        💬
      </button>

    </Layout>
  );
};

export default HomePage;