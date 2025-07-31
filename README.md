Erlebbar – Barrierefreie Events & Locations
Ein React + Vite Webprojekt für mehr digitale Teilhabe

„Erlebbar“ ist eine barrierefreundliche Webanwendung zur Darstellung und Bewertung barrierefreier Veranstaltungen und Orte. Ziel ist es, Menschen mit unterschiedlichen Bedürfnissen eine leicht zugängliche Plattform zu bieten, um inklusive Events und Locations zu entdecken und zu teilen.

Funktionen im Überblick

    Eventsuche per Ort oder PLZ

    automatische Standortbestimmung via Geolocation

    interaktive Karte mit Marker-Anzeige (Leaflet)

    Event-Liste mit Detailansicht

    Benutzerregistrierung und Login (JWT-basiert)

    Passwort-Reset via E-Mail

    geschützter Nutzerbereich mit Dashboard

    Events speichern und bewerten

    AccessibilityToolbar mit:

        Theme-Umschaltung (Hell/Dunkel)

        Schriftgrößenanpassung

        Vorlesefunktion (Text-to-Speech)

        Sprachumschaltung (Deutsch, Englisch, Französisch)

Technologie-Stack

    Frontend: React, Vite, Leaflet, react-i18next

    Backend: Node.js, Express, MongoDB (Atlas)

    Authentifizierung: JSON Web Token (JWT)

    E-Mail-Versand: Nodemailer

    Styling: CSS Modules, Bootstrap

Struktur (Frontend-Auszug)

src/
├── App.jsx
├── main.jsx
├── index.css
├── i18n.js
├── api/
│   └── api.js
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Map.jsx
│   ├── SearchBar.jsx
│   ├── EventList.jsx
│   ├── AccessibilityToolbar.jsx
│   ├── RatingStars.jsx
│   └── PrivateRoute.jsx
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── UserDashboardPage.jsx
    ├── ImpressumPage.jsx
    ├── DatenschutzPage.jsx
    └── SpendenPage.jsx

Installation & Entwicklung

Frontend starten:

npm install
npm run dev

Läuft lokal auf http://localhost:3000

Backend separat starten:

cd backend
npm install
npm run dev

Läuft auf http://localhost:5001

API-Routen (Auszug)

    POST /api/users/register – Registrierung

    POST /api/users/login – Login

    POST /api/users/forgot-password – Passwort-Reset-Link anfordern

    GET /api/events/search?q= – Events suchen

    POST /api/ratings – Bewertung absenden

    GET /api/ratings/:eventId – Bewertungen abrufen

Barrierefreiheit

„Erlebbar“ legt großen Wert auf digitale Zugänglichkeit:

    semantisches HTML & ARIA-Rollen

    vollständige Tastaturbedienung (ausbaufähig)

    Vorlesefunktion über Text-to-Speech

    kontrastreiche Themes

    mehrsprachige Inhalte über react-i18next

Bewertung & Nutzerbereich

Nutzer*innen mit Login können:

    Events speichern

    persönliche Listen im Dashboard verwalten

    eigene Bewertungen zu Events abgeben (Sterne-System)

    Bewertungen anderer sehen und filtern

Geplante Weiterentwicklungen

    Event-Erstellung für Veranstalter mit Barrierefreiheitsprüfung

    Filter nach Barrierefreiheitskriterien (z. B. Rollstuhlzugang, Leichte Sprache)

    CSV-Import für Veranstalter

    Integration von OpenStreetMap POIs

    Statistikseite über barrierefreie Angebote je Region

Hinweis

Dieses Projekt befindet sich in fortlaufender Entwicklung. Die meisten Features sind nutzbar, einige Bereiche (z. B. VoiceOver-Funktionen, Screenreader-Test) werden noch aktiv verbessert.

Kontakt

Bei Fragen oder Feedback einfach melden. Pull Requests, Bugmeldungen oder Anregungen sind willkommen.
