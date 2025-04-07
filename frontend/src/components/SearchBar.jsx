import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // 🌍 Automatische Standorterkennung nur einmal ausführen
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          onLocationSelect([latitude, longitude]);
          console.log(`📍 Automatischer Standort gesetzt: ${latitude}, ${longitude}`);
        },
        (err) => {
          console.warn("⚠️ Standortzugriff verweigert oder fehlgeschlagen:", err);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔍 Standort manuell suchen und an Map weitergeben
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Bitte einen gültigen Ort oder eine PLZ eingeben.");
      return;
    }

    try {
      setError(null);
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        { params: { format: "json", q: searchQuery } }
      );

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onLocationSelect([parseFloat(lat), parseFloat(lon)]);
        console.log(`📍 Standort erfolgreich gesetzt: ${lat}, ${lon}`);
      } else {
        setError("Standort nicht gefunden.");
      }
    } catch (err) {
      console.error("❌ Fehler bei Standortsuche:", err);
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

        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} /> Suchen
        </button>
      </div>

      <p id="search-help" className="sr-only">
        Geben Sie einen Ort oder eine PLZ ein und drücken Sie Enter.
      </p>

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
