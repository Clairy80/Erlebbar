import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AccessibilityToolbar = () => {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("en");
  const { i18n, t } = useTranslation();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const increaseFontSize = () => {
    const newSize = fontSize + 2;
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const decreaseFontSize = () => {
    const newSize = fontSize - 2;
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const speakPageContent = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(document.body.innerText);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{
      padding: "1rem",
      borderBottom: "1px solid gray",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center"
    }}>
      {/* Sprachumschaltung */}
      <div>
        <label htmlFor="language-select" style={{ marginRight: "0.5rem" }}>{t('language')}:</label>
        <select id="language-select" value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {/* Theme Toggle */}
      <div>
        <button onClick={toggleTheme}>
          {theme === "light" ? t('darkMode') : t('lightMode')}
        </button>
      </div>

      {/* Schriftgrößensteuerung */}
      <div>
        <button onClick={decreaseFontSize}>A-</button>
        <span style={{ margin: "0 0.5rem" }}>{t('fontSize')}: {fontSize}px</span>
        <button onClick={increaseFontSize}>A+</button>
      </div>

      {/* Text-to-Speech */}
      <div>
        <button onClick={speakPageContent}>{t('readPage')}</button>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
