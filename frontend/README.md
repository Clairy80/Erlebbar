React + Vite

Barrierefreie Events & Locations

Ein React-Projekt mit Fokus auf Barrierefreiheit, Mehrsprachigkeit und Kartenintegration zur Darstellung barrierefreier Events und Locations.

Features

Startseite

Event-Suche: Eingabe von Postleitzahl oder Ort über die Suchleiste.

Automatische Standortbestimmung: Ermittelt automatisch den aktuellen Standort des Nutzers via Geolocation.

Kartenintegration: Zeigt Events als Marker auf einer interaktiven Karte mittels Leaflet.

Event-Liste: Listet gefundene Events unterhalb der Karte auf.

Benutzerverwaltung

Registrierung: Anmeldung für Veranstalter und Nutzer.

Login: Anmeldung mit JWT-Token, Speicherung im localStorage.

Passwort-Reset: Passwort zurücksetzen mit E-Mail-Versand via Nodemailer.

Barrierefreiheit

AccessibilityToolbar:

Theme Toggle: Wechsel zwischen Hell- und Dunkelmodus.

Schriftgrößensteuerung: Anpassung der Schriftgröße.

Sprachumschaltung: Mehrsprachigkeit (Englisch, Deutsch, Französisch) mit react-i18next.

Text-to-Speech: Vorlesefunktion für den Seiteninhalt.

Semantische HTML-Struktur, ARIA-Attribute und Tastaturnavigation (noch ausbaufähig).

Footer

Enthält Links zu Impressum, Datenschutzerklärung und Spenden.

Separate Routen: /impressum, /datenschutz, /spenden.

Ordnerstruktur (Frontend)

frontend/
├── package.json
├── vite.config.js
├── public/
│   └── index.html
└── src/
    ├── index.css
    ├── i18n.js
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── AccessibilityToolbar.jsx
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── Searchbar.jsx
    │   ├── Map.jsx
    │   └── EventList.jsx
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── ImpressumPage.jsx
        ├── DatenschutzPage.jsx
        └── SpendenPage.jsx

Installation & Start

Frontend

Abhängigkeiten installieren:

npm install

Frontend starten (Vite):

npm run dev

Das Projekt läuft dann auf http://localhost:3000.

Backend

Das Backend (Node.js/Express) muss separat gestartet werden:

npm run dev

Typischerweise ist der Backend-Server unter http://localhost:5001 erreichbar.

i18n-Konfiguration

Die Mehrsprachigkeit wird mit react-i18next umgesetzt.

Bibliotheken installieren:

npm install react-i18next i18next

Konfiguration:

Die Datei src/i18n.js enthält die Konfiguration und Übersetzungsobjekte für Englisch, Deutsch und Französisch.

Backend-API

Wichtige API-Routen

Benutzerverwaltung:

POST /api/users/register – Registrierung eines neuen Nutzers.

POST /api/users/login – Anmeldung, Rückgabe eines JWT-Tokens.

POST /api/users/forgot-password – Anfordern eines Passwort-Reset-Tokens.

POST /api/users/reset-password – Zurücksetzen des Passworts.

Events-Suche:

GET /api/events/search?q=<Suchbegriff> – Suche nach Events.

JWT-Authentifizierung

Das Token wird im Frontend gespeichert und bei geschützten API-Aufrufen im Header mitgesendet:

Authorization: Bearer <token>

Weitere Hinweise

Barrierefreiheit

Neben der AccessibilityToolbar sollten weitere ARIA-Attribute und eine semantische Struktur implementiert werden, um die Seite noch zugänglicher zu machen.

Die Text-to-Speech-Funktion liest aktuell den gesamten Seiteninhalt vor. Für gezieltere Vorlesefunktionen können IDs für bestimmte Abschnitte vergeben werden.

Styling

Ein Mix aus globalen CSS-Styles (index.css), Bootstrap (für die Navbar) und individuellen Komponenten-Stilen (CSS Modules oder inline) sorgt für ein modernes Erscheinungsbild.

Die Footer-Komponente sorgt für ein konsistentes Layout mit Links zu Impressum, Datenschutz und Spenden.

Fazit

Dieses Projekt bietet eine solide Basis für barrierefreie Veranstaltungen mit:

Such- und Kartenintegration,

Benutzerverwaltung,

Mehrsprachigkeit und Barrierefreiheit über eine AccessibilityToolbar,

sowie einer sauberen, modularen Codebasis.

Falls Fragen oder Probleme auftauchen, gerne den Entwickler kontaktieren.

React + Vite

Dieses Projekt basiert auf React mit Vite und bietet Fast Refresh für eine bessere Entwicklungsumgebung.

Offizielle Plugins:

@vitejs/plugin-react – Nutzt Babel für Fast Refresh.

@vitejs/plugin-react-swc – Nutzt SWC für Fast Refresh.

🔥 Aktualisierungen & Fixes vom 5.3.25 🔥
✅ Backend-Updates
User-Authentifizierung:
Registrierung, Login & Token-Erstellung korrigiert
Fehler mit username-Feld behoben
Token wird nun korrekt zurückgegeben
Event- und Location-APIs:
GET/POST für Events & Locations gefixt
Routen /api/events und /api/locations funktionieren jetzt
Schutz für verifizierte User bei geschützten Routen verbessert
Server-Setup:
CORS aktiviert
Fehler mit nicht gestarteter DB-Verbindung behoben
Server läuft stabil auf localhost:5000
✅ Frontend-Updates
API-Aufrufe zentralisiert in api/api.jsx
Event- und Location-Daten in Map.jsx korrekt geladen
Fixes für AuthContext & authService.js
Korrektur der SearchBar.jsx, damit sie API nutzt
ARIA-Verbesserungen für Barrierefreiheit
Fehlermeldungen verbessert, damit API-Antworten verständlicher sind

🔧 Verbesserungen & Fixes (10. März 2025)
Heute wurden folgende wichtige Verbesserungen an der App vorgenommen:

✅ Suchleiste (SearchBar) global gemacht

SearchBar ist jetzt nur noch in App.jsx eingebunden und nicht mehr in Map.jsx.
Die Karte (Map.jsx) erhält die Standortdaten direkt von App.jsx.
✅ Automatische & manuelle Standortsuche verbessert

Nutzer können ihren Standort automatisch erkennen lassen.
Eingabe von Ort oder PLZ in SearchBar aktualisiert nun zuverlässig die Karte.
✅ Map-Logik aufgeräumt & Doppelte Elemente entfernt

Karte (Map.jsx) zentriert sich jetzt korrekt, wenn ein neuer Standort eingegeben wird.
Unnötige useState-Updates reduziert und Code optimiert.
✅ Fehlermeldungen & Konsistenz verbessert

Bessere Fehlerbehandlung für Standortsuche.
Mehr Logging für Debugging.
🎉 Ergebnis: Die Karte funktioniert jetzt sauber, ohne doppelte SearchBar, und Nutzer können problemlos Standorte suchen!

🔥 Wichtige Info zu export default vs. export {}

Wann benutzt du export default?

✅ Wenn eine Datei nur eine einzige Haupt-Funktion oder ein Haupt-Objekt exportiert.Das sieht dann so aus:

const connectDB = async () => {
  // Datenbankverbindung
};

export default connectDB;

Dann kannst du in einer anderen Datei einfach ohne geschweifte Klammern importieren:

import connectDB from './db.js';

Wann benutzt du export {} (named exports)?

✅ Wenn du mehrere Funktionen aus einer Datei exportierst!Beispiel aus userController.js:

export const registerUser = async (req, res) => { ... };
export const loginUser = async (req, res) => { ... };
export const verifyEmail = async (req, res) => { ... };
export const getUserProfile = async (req, res) => { ... };

Dann musst du sie in anderen Dateien gezielt mit geschweiften Klammern importieren:

import { registerUser, loginUser, verifyEmail, getUserProfile } from '../controllers/userController.js';

🚀 Was bedeutet das für dein Projekt?

✅ Nutze export default in diesen Dateien:

db.js (weil es nur connectDB exportiert)

server.js (falls du den app-Server exportieren willst)

authMiddleware.js (wenn du nur eine einzige Middleware exportierst)

❌ KEIN export default in userController.js, eventController.js, locationController.js usw., weil sie mehrere Funktionen haben!

Verbesserungen und Fixes (11.3.25)
✅ Bugfix: eventRoutes.js hatte keinen export default, jetzt behoben.
✅ Fix in server.js: Alle Routen korrekt eingebunden.
✅ Event-Routen angepasst: Organisatoren können Events erstellen, abrufen, aktualisieren und löschen.
✅ Backend getestet & läuft stabil! 🚀

Update (18.3.25)
🚀 Was wurde zuletzt gemacht?
🔹 Backend: Fehlerbehebung & Optimierung
✅ MongoDB Atlas eingebunden – Verbindung stabil & doppelte Initialisierung behoben
✅ Fehlersuche & Fixes in den Routen (Events & Locations jetzt korrekt abrufbar)
✅ Datenbank-Validierungen verbessert (Pflichtfelder, Geolocation-Abfragen)
✅ Event- & Location-Controller gefixt (keine doppelten Exports mehr)
✅ Auth- & User-Handling optimiert (Verifizierungs-Flow, Login, Rollenverwaltung)

🔹 Frontend: Map & UI Fixes
✅ Map-Integration überarbeitet – Events & Locations jetzt sichtbar
✅ Fehlende API-Endpunkte korrigiert (GET /api/events, /api/locations funktioniert)
✅ Automatische Standortsuche getestet & bestätigt
✅ Debugging für Ladefehler (404 & leere Daten) behoben
✅ Design-Überarbeitung gestartet (Barrierefreiheit, Farben, Kontraste)

🔹 Nächste Schritte:
🔘 Design-Optimierung für bessere Zugänglichkeit (Farben, Kontraste, UI-Elemente)
🔘 Seitentitel & Branding auf „Erlebbar“ ändern
🔘 Navigationsleiste & Struktur anpassen
🔘 Fehlermeldungen verbessern (UX-Optimierung)

Neuer Plan (20.3.25)

/frontend
│── /src
│   ├── /components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Map.jsx
│   │   ├── EventList.jsx  ✅ (🆕 Hier wird das Speichern & Bewerten ergänzt)
│   │   ├── AccessibilityToolbar.jsx
│   │   ├── PrivateRoute.jsx ✅ (🆕 Falls Login-Bereich geschützt sein soll)
│   │   ├── UserDashboard.jsx ✅ (🆕 Zeigt gespeicherte Events)
│   ├── /pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ImpressumPage.jsx
│   │   ├── DatenschutzPage.jsx
│   │   ├── SpendenPage.jsx
│   │   ├── UserDashboardPage.jsx ✅ (🆕 Mein Bereich)
│   ├── /api
│   │   ├── api.js ✅ (Falls API-Aufrufe zentral verwaltet werden)
│   ├── App.jsx ✅ (Routen für Login & User-Dashboard ergänzen)
│   ├── index.css
│   ├── main.jsx
│── /backend
│   ├── /routes
│   │   ├── eventRoutes.js ✅ (🆕 Event speichern & bewerten API)
│   ├── /controllers
│   │   ├── eventController.js ✅ (🆕 Methoden für Speicherung & Bewertung)
│   ├── server.js
