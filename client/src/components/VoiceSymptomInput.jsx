import React, { useState, useRef } from "react";
import { message } from "antd";
import "./VoiceSymptomInput.css";

/**
 * Voice-to-text symptom input using the browser's built-in
 * Web Speech API — zero external API key, zero cost, works in
 * Chrome/Edge out of the box.
 *
 * USAGE — drop this into your SymptomChecker.jsx chat input row,
 * right next to the text input:
 *
 *   import VoiceSymptomInput from "./VoiceSymptomInput";
 *   ...
 *   <VoiceSymptomInput onResult={(text) => setInput(text)} />
 */
const VoiceSymptomInput = ({ onResult, language = "en-IN" }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleVoiceClick = () => {
    if (!isSupported) {
      message.warning("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language; // "en-IN" works well for Indian English accents
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        message.error("Microphone access denied. Please allow microphone permissions.");
      } else if (event.error === "no-speech") {
        message.info("Didn't catch that. Try speaking again.");
      }
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  if (!isSupported) return null; // gracefully hide on unsupported browsers

  return (
    <button
      className={`vsi-btn ${listening ? "vsi-btn--listening" : ""}`}
      onClick={handleVoiceClick}
      title={listening ? "Listening... click to stop" : "Speak your symptoms"}
      type="button"
    >
      {listening ? "🔴" : "🎤"}
      {listening && <span className="vsi-pulse-ring" />}
    </button>
  );
};

export default VoiceSymptomInput;
