import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 📌 Sprachressourcen mit Übersetzungen
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      register: "Register",
      search: "Search",
      language: "Language",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      fontSize: "Font Size",
      readPage: "Read Page",
      logout: "Logout",
      events: "Events",
      locations: "Locations",
      profile: "Profile",
      settings: "Settings"
    }
  },
  de: {
    translation: {
      welcome: "Willkommen",
      login: "Anmelden",
      register: "Registrieren",
      search: "Suchen",
      language: "Sprache",
      darkMode: "Dunkelmodus",
      lightMode: "Hellmodus",
      fontSize: "Schriftgröße",
      readPage: "Seite vorlesen",
      logout: "Abmelden",
      events: "Veranstaltungen",
      locations: "Orte",
      profile: "Profil",
      settings: "Einstellungen"
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      login: "Connexion",
      register: "Inscription",
      search: "Chercher",
      language: "Langue",
      darkMode: "Mode sombre",
      lightMode: "Mode clair",
      fontSize: "Taille de la police",
      readPage: "Lire la page",
      logout: "Se déconnecter",
      events: "Événements",
      locations: "Lieux",
      profile: "Profil",
      settings: "Paramètres"
    }
  }
};

// 📌 Ermittlung der bevorzugten Sprache aus localStorage oder Browsereinstellungen
const userLang = localStorage.getItem('i18nextLng') || navigator.language.split('-')[0] || "en";

// 📌 i18next Initialisierung
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: userLang, // Standardsprache (wenn im localStorage vorhanden)
    fallbackLng: "en", // Fallback-Sprache
    interpolation: {
      escapeValue: false // Sicherheitseinstellung (keine ungewollte Escaping)
    },
    detection: {
      order: ['localStorage', 'navigator'], // Sprache wird zuerst aus localStorage gezogen
      caches: ['localStorage'], // Speichert die Sprache für spätere Sitzungen
    }
  });

export default i18n;
