import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./NearbyDoctors.css";

/**
 * Drop this into HomePage.jsx (above or below the doctor search bar):
 *
 *   import NearbyDoctors from "../components/NearbyDoctors";
 *   ...
 *   <NearbyDoctors />
 */
const NearbyDoctors = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(null);

  /* ── manual search ── */
  const handleSearch = async (cityValue) => {
    const searchCity = (cityValue || city).trim();
    if (!searchCity) {
      message.warning("Please enter your city or area");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/location/nearby-doctors", {
        city: searchCity,
      });
      setLoading(false);
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Could not fetch nearby doctors");
    }
  };

  /* ── auto-detect using browser GPS + free reverse-geocoding ── */
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      message.error("Location detection is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Free, no-API-key reverse geocoding (OpenStreetMap Nominatim)
          const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const address = geoRes.data?.address || {};
          const detectedCity =
            address.city || address.town || address.village || address.state || "";

          setDetecting(false);

          if (detectedCity) {
            setCity(detectedCity);
            message.success(`Location detected: ${detectedCity}`);
            handleSearch(detectedCity);
          } else {
            message.warning("Couldn't determine your city. Please type it manually.");
          }
        } catch (error) {
          setDetecting(false);
          console.log(error);
          message.error("Failed to detect location. Please type your city manually.");
        }
      },
      (error) => {
        setDetecting(false);
        console.log(error);
        message.warning("Location access denied. Please type your city manually.");
      }
    );
  };

  return (
    <div className="nd-section">
      <div className="nd-header">
        <h2 className="nd-title">📍 Find Doctors Near You</h2>
        <p className="nd-sub">Enter your city or auto-detect your location</p>
      </div>

      <div className="nd-search-row">
        <input
          className="nd-input"
          placeholder="Enter your city (e.g. Mumbai, Delhi...)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="nd-btn nd-btn--detect" onClick={handleDetectLocation} disabled={detecting}>
          {detecting ? "Detecting..." : "📍 Use My Location"}
        </button>
        <button className="nd-btn nd-btn--search" onClick={() => handleSearch()} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {result && (
        <div className="nd-results">
          <p className="nd-results__msg">{result.message}</p>

          {result.data.nearby.length > 0 && (
            <>
              <h4 className="nd-results__heading">🎯 Doctors near you</h4>
              <div className="nd-doctor-grid">
                {result.data.nearby.map((doc) => (
                  <div
                    key={doc._id}
                    className="nd-doctor-card nd-doctor-card--match"
                    onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
                  >
                    <span className="nd-doctor-card__badge">📍 Near you</span>
                    <p className="nd-doctor-card__name">
                      Dr. {doc.firstName} {doc.lastName}
                    </p>
                    <p className="nd-doctor-card__spec">{doc.specialization}</p>
                    <p className="nd-doctor-card__address">📌 {doc.address}</p>
                    <p className="nd-doctor-card__fee">₹{doc.feesPerCunsaltation}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.data.others.length > 0 && (
            <>
              <h4 className="nd-results__heading">🌐 Other available doctors</h4>
              <div className="nd-doctor-grid">
                {result.data.others.slice(0, 6).map((doc) => (
                  <div
                    key={doc._id}
                    className="nd-doctor-card"
                    onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
                  >
                    <p className="nd-doctor-card__name">
                      Dr. {doc.firstName} {doc.lastName}
                    </p>
                    <p className="nd-doctor-card__spec">{doc.specialization}</p>
                    <p className="nd-doctor-card__address">📌 {doc.address}</p>
                    <p className="nd-doctor-card__fee">₹{doc.feesPerCunsaltation}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyDoctors;
