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