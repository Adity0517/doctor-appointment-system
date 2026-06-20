import React, { useState } from "react";
import Layout from "../components/Layout";
import "./BmiCalculator.css";

const BmiCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");

  /* ── BMI category helper ── */
  const getCategory = (value) => {
    if (value < 18.5) return { label: "Underweight", color: "#3B82F6" };
    if (value < 25)   return { label: "Normal", color: "#22C55E" };
    if (value < 30)   return { label: "Overweight", color: "#F59E0B" };
    return { label: "Obese", color: "#EF4444" };
  };

  const calculateBMI = () => {
    if (!weight || !height) return;
    const result = weight / ((height / 100) * (height / 100));
    setBmi(result.toFixed(2));
  };

  const category = bmi ? getCategory(parseFloat(bmi)) : null;

  return (
    <Layout>
      <div className="bmi-banner">
        <h1 className="bmi-banner__title">⚖️ BMI Calculator</h1>
        <p className="bmi-banner__sub">
          Check your Body Mass Index and understand your health status
        </p>
      </div>

      <div className="bmi-card">
        <div className="bmi-form">
          <div className="bmi-field">
            <label>Weight (kg)</label>
            <input
              type="number"
              className="bmi-input"
              placeholder="e.g. 65"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="bmi-field">
            <label>Height (cm)</label>
            <input
              type="number"
              className="bmi-input"
              placeholder="e.g. 170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <button
            className="bmi-btn"
            onClick={calculateBMI}
            disabled={!weight || !height}
          >
            Calculate BMI
          </button>
        </div>

        {bmi && category && (
          <div className="bmi-result" style={{ borderColor: category.color }}>
            <p className="bmi-result__label">Your BMI</p>
            <h2 className="bmi-result__value" style={{ color: category.color }}>
              {bmi}
            </h2>
            <span
              className="bmi-result__category"
              style={{ background: `${category.color}1A`, color: category.color }}
            >
              {category.label}
            </span>
          </div>
        )}
      </div>

      <div className="bmi-info">
        <h4>📊 BMI Categories</h4>
        <div className="bmi-info__grid">
          <div className="bmi-info__item"><span className="bmi-dot" style={{ background: "#3B82F6" }} /> Underweight: &lt; 18.5</div>
          <div className="bmi-info__item"><span className="bmi-dot" style={{ background: "#22C55E" }} /> Normal: 18.5 – 24.9</div>
          <div className="bmi-info__item"><span className="bmi-dot" style={{ background: "#F59E0B" }} /> Overweight: 25 – 29.9</div>
          <div className="bmi-info__item"><span className="bmi-dot" style={{ background: "#EF4444" }} /> Obese: 30+</div>
        </div>
      </div>
    </Layout>
  );
};

export default BmiCalculator;