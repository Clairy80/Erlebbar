import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AccessibilityToolbar = () => {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("de"); // Standard auf Deutsch setzen
  const { i18n, t } = useTranslation();

  // Theme-Toggle mit ARIA-Update
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Schriftgröße anpassen mit ARIA-Update
  const adjustFontSize = (change) => {
    const newSize = fontSize + change;
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  // Sprache wechseln mit ARIA-Unterstützung
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  // Text-to-Speech Funktionalität
  const speakPageContent = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(document.body.innerText);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section
      aria-labelledby="accessibility-toolbar-heading"
      role="region"
      style={{
        padding: "1rem",
        borderBottom: "1px solid gray",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <h2 id="accessibility-toolbar-heading" className="sr-only">
        {t('accessibilityToolbar')}
      </h2>

      {/* Sprachumschaltung */}
      <div>
        <label htmlFor="language-select" style={{ marginRight: "0.5rem" }}>
          {t('language')}:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
          aria-label={t('languageSelection')}
        >
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {/* Theme Toggle */}
      <div>
        <button
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? t('switchToLightMode') : t('switchToDarkMode')}
        >
          {theme === "light" ? t('darkMode') : t('lightMode')}
        </button>
      </div>

      {/* Schriftgrößensteuerung */}
      <div>
        <button onClick={() => adjustFontSize(-2)} aria-label={t('decreaseFontSize')}>
          A-
        </button>
        <span style={{ margin: "0 0.5rem" }} aria-live="polite">
          {t('fontSize')}: {fontSize}px
        </span>
        <button onClick={() => adjustFontSize(2)} aria-label={t('increaseFontSize')}>
          A+
        </button>
      </div>

      {/* Text-to-Speech */}
      <div>
        <button onClick={speakPageContent} aria-label={t('readPage')}>
          {t('readPage')}
        </button>
      </div>
    </section>
  );
};

export default AccessibilityToolbar;
