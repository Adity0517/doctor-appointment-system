import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SymptomChecker.css";
import VoiceSymptomInput from "./VoiceSymptomInput";

/**
 * Floating AI Symptom Checker widget.
 * Drop this once inside Layout.jsx so it appears on every page:
 *
 *   import SymptomChecker from "./SymptomChecker";
 *   ...
 *   <main className="lyt-body">{children}</main>
 *   <SymptomChecker />
 */
const SymptomChecker = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Hi! 👋 Tell me your symptoms (e.g. \"fever and headache\") and I'll suggest which type of doctor to see.",
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/symptom-checker/analyze", {
        message: text,
      });

      const data = res.data;

      if (data.emergency) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", emergency: true, text: data.reply },
        ]);
      } else if (data.matched) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: data.reply,
            specialization: data.specialization,
            doctors: data.doctors,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* ── floating launcher button ── */}
      {!open && (
        <button className="sc-launcher" onClick={() => setOpen(true)} title="AI Symptom Checker">
          🤖
          <span className="sc-launcher__badge">AI</span>
        </button>
      )}

      {/* ── chat window ── */}
      {open && (
        <div className="sc-window">
          <div className="sc-header">
            <div className="sc-header__info">
              <span className="sc-header__icon">🤖</span>
              <div>
                <p className="sc-header__title">Symptom Checker</p>
                <p className="sc-header__sub">AI-powered • Not a diagnosis</p>
              </div>
            </div>
            <button className="sc-close-btn" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="sc-body">
            {messages.map((msg, i) => (
              <div key={i} className={`sc-msg sc-msg--${msg.from}`}>
                <div className={`sc-bubble ${msg.emergency ? "sc-bubble--emergency" : ""}`}>
                  {msg.text}

                  {msg.specialization && (
                    <div className="sc-spec-tag">🩺 {msg.specialization}</div>
                  )}

                  {msg.doctors && msg.doctors.length > 0 && (
                    <div className="sc-doctor-list">
                      {msg.doctors.map((doc) => (
                        <div
                          key={doc._id}
                          className="sc-doctor-card"
                          onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
                        >
                          <span className="sc-doctor-card__name">
                            Dr. {doc.firstName} {doc.lastName}
                          </span>
                          <span className="sc-doctor-card__fee">₹{doc.feesPerCunsaltation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="sc-msg sc-msg--bot">
                <div className="sc-bubble sc-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="sc-input-row">
            <input
              className="sc-input"
              placeholder="Describe your symptoms..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <VoiceSymptomInput onResult={(text) => setInput(text)} />
            <button className="sc-send-btn" onClick={handleSend} disabled={loading}>
              ➤
            </button>
          </div>
          <p className="sc-disclaimer">
            ⚠️ Not a substitute for professional medical advice.
          </p>
        </div>
      )}
    </>
  );
};

export default SymptomChecker;
