// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "login": "Login",
      "register": "Register",
      "search": "Search",
      "language": "Language",
      "darkMode": "Dark Mode",
      "lightMode": "Light Mode",
      "fontSize": "Font Size",
      "readPage": "Read Page"
      // Weitere Übersetzungen...
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen",
      "login": "Anmelden",
      "register": "Registrieren",
      "search": "Suchen",
      "language": "Sprache",
      "darkMode": "Dunkelmodus",
      "lightMode": "Hellmodus",
      "fontSize": "Schriftgröße",
      "readPage": "Seite vorlesen"
      // Weitere Übersetzungen...
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue",
      "login": "Connexion",
      "register": "Inscription",
      "search": "Chercher",
      "language": "Langue",
      "darkMode": "Mode sombre",
      "lightMode": "Mode clair",
      "fontSize": "Taille de la police",
      "readPage": "Lire la page"
      // Weitere Übersetzungen...
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Standardsprache
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
