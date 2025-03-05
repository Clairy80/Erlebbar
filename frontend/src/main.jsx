import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n"; 
import "./index.css";
import "leaflet/dist/leaflet.css";

// 💡 Lazy Loading für Leaflet (Performance-Boost)
import("leaflet").then((L) => {
  import("leaflet/dist/images/marker-icon-2x.png").then((markerIcon2x) => {
    import("leaflet/dist/images/marker-icon.png").then((markerIcon) => {
      import("leaflet/dist/images/marker-shadow.png").then((markerShadow) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: markerIcon2x.default,
          iconUrl: markerIcon.default,
          shadowUrl: markerShadow.default,
        });
      });
    });
  });
});

// 🌍 Barrierefreiheit: Sicherstellen, dass das HTML-Element ein `lang`-Attribut hat
document.documentElement.setAttribute("lang", "de");

// 🚀 React.StrictMode für bessere Fehlerwarnungen in der Entwicklung
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
