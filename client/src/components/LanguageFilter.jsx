import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LanguageFilter.css";

const COMMON_LANGUAGES = [
  "English", "Hindi", "Bhojpuri", "Tamil", "Telugu", "Bengali",
  "Marathi", "Gujarati", "Punjabi", "Kannada", "Malayalam", "Urdu",
];

/**
 * Lets patients filter doctors by the language/dialect they speak.
 *
 * USAGE — drop into HomePage.jsx near the doctor search section:
 *   import LanguageFilter from "../components/LanguageFilter";
 *   ...
 *   <LanguageFilter />
 */
const LanguageFilter = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (lang) => {
    if (selected === lang) {
      setSelected(null);
      setResults([]);
      return;
    }
    setSelected(lang);
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/language/filter-doctors", { language: lang });
      setLoading(false);
      if (res.data.success) setResults(res.data.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="lf-section">
      <div className="lf-header">
        <h2 className="lf-title">🗣️ Find a Doctor Who Speaks Your Language</h2>
        <p className="lf-sub">Communicate comfortably in your preferred language or dialect</p>
      </div>

      <div className="lf-chips">
        {COMMON_LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`lf-chip ${selected === lang ? "lf-chip--active" : ""}`}
            onClick={() => handleSelect(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      {selected && (
        <div className="lf-results">
          {loading ? (
            <p className="lf-loading">Searching...</p>
          ) : results.length === 0 ? (
            <p className="lf-empty">No doctors found who speak {selected} yet.</p>
          ) : (
            <div className="lf-doctor-grid">
              {results.map((doc) => (
                <div
                  key={doc._id}
                  className="lf-doctor-card"
                  onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
                >
                  <p className="lf-doctor-card__name">Dr. {doc.firstName} {doc.lastName}</p>
                  <p className="lf-doctor-card__spec">{doc.specialization}</p>
                  <div className="lf-doctor-card__langs">
                    {(doc.languagesSpoken || []).map((l) => (
                      <span key={l} className="lf-lang-tag">{l}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageFilter;
