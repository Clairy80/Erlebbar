import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n";
import "./index.css"; // Falls du alles in "index.css" hast
import "leaflet/dist/leaflet.css";

// 💡 Lazy Loading für Leaflet (Performance-Boost)
import("leaflet").then((L) => {
  Promise.all([
    import("leaflet/dist/images/marker-icon-2x.png"),
    import("leaflet/dist/images/marker-icon.png"),
    import("leaflet/dist/images/marker-shadow.png"),
  ]).then(([markerIcon2x, markerIcon, markerShadow]) => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.default,
      iconUrl: markerIcon.default,
      shadowUrl: markerShadow.default,
    });
  });
});

// 🌍 Barrierefreiheit: HTML-Sprache setzen
document.documentElement.setAttribute("lang", "de");

// 🚀 React.StrictMode für bessere Debugging-Erfahrung
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("❌ Fehler: `#root`-Element nicht gefunden!");
}
