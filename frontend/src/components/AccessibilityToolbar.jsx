import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AccessibilityToolbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem("fontSize")) || 16);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "de");
  const { i18n, t } = useTranslation();

  // 🎨 Dark/Light Mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 🔠 Schriftgröße
  const adjustFontSize = (change) => {
    const newSize = Math.min(Math.max(fontSize + change, 12), 24);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem("fontSize", newSize);
  };

  // 🌍 Sprache wechseln
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // 🔊 Vorlesefunktion
  const speakPageContent = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(document.body.innerText);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [theme, fontSize]);

  return (
    <aside className="accessibility-toolbar">
      <h2 id="accessibility-toolbar-heading" className="sr-only">
        {t('accessibilityToolbar')}
      </h2>

      {/* 🌍 Sprache */}
      <div className="toolbar-item">
        <label htmlFor="language-select" className="sr-only">
          {t('language')}
        </label>
        <select
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
          aria-label={t('languageSelection')}
        >
          <option value="de">🇩🇪</option>
          <option value="en">🇬🇧</option>
          <option value="fr">🇫🇷</option>
        </select>
      </div>

      {/* 🌙 Dark Mode */}
      <div className="toolbar-item">
        <button onClick={toggleTheme} aria-pressed={theme === "dark"}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* 🔠 Schriftgröße */}
      <div className="toolbar-item">
        <button onClick={() => adjustFontSize(-2)} aria-label={t('decreaseFontSize')}>
          A-
        </button>
        <span>{fontSize}px</span>
        <button onClick={() => adjustFontSize(2)} aria-label={t('increaseFontSize')}>
          A+
        </button>
      </div>

      {/* 🔊 Vorlesefunktion */}
      <div className="toolbar-item">
        <button onClick={speakPageContent} aria-label={t('readPage')}>
          🔊
        </button>
      </div>
    </aside>
  );
};

export default AccessibilityToolbar;
