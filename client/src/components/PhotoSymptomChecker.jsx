import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./PhotoSymptomChecker.css";

/**
 * Upload a photo of a visible symptom (rash, swelling, wound) and
 * get a basic AI-assisted specialist suggestion.
 *
 * USAGE — standalone page or modal, e.g. linked from the chatbot:
 *   import PhotoSymptomChecker from "../components/PhotoSymptomChecker";
 *   <PhotoSymptomChecker />
 */
const PhotoSymptomChecker = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      message.error("Please select an image file");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      message.warning("Please select a photo first");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("/api/v1/photo-symptom/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      if (res.data.success) {
        setResult(res.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to analyze image");
    }
  };

  return (
    <div className="psc-card">
      <div className="psc-header">
        <h3 className="psc-title">📷 Symptom Photo Checker</h3>
        <p className="psc-sub">Upload a photo of a visible symptom for a quick AI-assisted suggestion</p>
      </div>

      {!preview ? (
        <div className="psc-upload-zone" onClick={() => fileInputRef.current?.click()}>
          <div className="psc-upload-icon">📤</div>
          <p className="psc-upload-text">Click to upload a photo</p>
          <p className="psc-upload-hint">JPG, PNG up to 5MB</p>
        </div>
      ) : (
        <div className="psc-preview-wrap">
          <img src={preview} alt="preview" className="psc-preview-img" />
          <button
            className="psc-change-btn"
            onClick={() => {
              setPreview(null);
              setFile(null);
              setResult(null);
            }}
          >
            Change Photo
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {preview && !result && (
        <button className="psc-analyze-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "🔍 Analyze Photo"}
        </button>
      )}

      {result && (
        <div className="psc-result">
          <div className="psc-result__spec">🩺 Suggested: {result.specialization}</div>
          <p className="psc-result__msg">{result.message}</p>

          {result.doctors && result.doctors.length > 0 && (
            <div className="psc-doctor-list">
              {result.doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="psc-doctor-card"
                  onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
                >
                  <span>Dr. {doc.firstName} {doc.lastName}</span>
                  <span className="psc-doctor-card__fee">₹{doc.feesPerCunsaltation}</span>
                </div>
              ))}
            </div>
          )}

          <p className="psc-disclaimer">⚠️ {result.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoSymptomChecker;
