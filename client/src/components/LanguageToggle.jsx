import React from "react";
import { useTranslation } from "react-i18next";
import "./LanguageToggle.css";

/**
 * Drop this into Layout.jsx header, next to the dark-mode toggle:
 *
 *   import LanguageToggle from "./LanguageToggle";
 *   ...
 *   <LanguageToggle />
 */
const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(newLang);
  };

  return (
    <button className="lt-btn" onClick={toggleLanguage} title="Switch language">
      {i18n.language === "hi" ? "EN" : "हिं"}
    </button>
  );
};

export default LanguageToggle;
