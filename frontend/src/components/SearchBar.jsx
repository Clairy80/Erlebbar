import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // 🌍 **Automatische Standorterkennung**
  useEffect(() => {
    if (onLocationSelect && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`📍 Automatisch erkannter Standort: ${latitude}, ${longitude}`);
          onLocationSelect([latitude, longitude]); // ✅ Map aktualisieren
        },
        (error) => {
          console.warn("⚠️ Geolocation fehlgeschlagen oder blockiert:", error);
        }
      );
    }
  }, [onLocationSelect]);

  // 🔍 **Manuelle Standortsuche**
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Bitte einen gültigen Ort oder eine PLZ eingeben.");
      return;
    }

    try {
      setError(null);
      console.log(`🔍 Suche nach: ${searchQuery}`);
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        console.log(`📍 Neuer Standort gefunden: ${lat}, ${lon}`);
        onLocationSelect([parseFloat(lat), parseFloat(lon)]); // ✅ Map aktualisieren
      } else {
        setError("Standort nicht gefunden.");
      }
    } catch (error) {
      console.error("❌ Fehler bei der Standortsuche:", error);
      setError("Fehler bei der Standortsuche.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="search-bar"
      aria-label="Suchleiste zur Standortsuche"
    >
      <div className="search-container">
        <label htmlFor="location-search" className="sr-only">
          Standort suchen
        </label>

        {/* 🏷️ Suchfeld mit Lupe-Icon */}
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            id="location-search"
            type="text"
            placeholder="Postleitzahl oder Ort eingeben..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-describedby="search-help"
            className="search-input"
          />
        </div>

        {/* 🔘 Such-Button */}
        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} /> Suchen
        </button>
      </div>

      <p id="search-help" className="sr-only">
        Geben Sie einen Ort oder eine PLZ ein und drücken Sie Enter.
      </p>

      {/* 🚨 Fehlermeldung mit Warnsymbol */}
      {error && (
        <p className="search-error" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
          {error}
        </p>
      )}
    </form>
  );
};

export default SearchBar;
