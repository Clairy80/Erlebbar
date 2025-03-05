import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/Searchbar.jsx";
import Map from "./components/Map";
import EventList from "./components/EventList";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ImpressumPage from "./pages/ImpressumPage";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import DatenschutzPage from "./pages/DatenschutzPage.jsx";
import SpendenPage from "./pages/SpendenPage.jsx";
import { geocodeLocation, fetchEvents } from "./services/api"; // API-Funktionen importieren
import "leaflet/dist/leaflet.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Automatische Standortsuche beim ersten Laden
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.error("Fehler bei der Standortbestimmung:", error)
      );
    }
  }, [location]);

  // Geocoding aufrufen, wenn sich der Suchbegriff ändert
  useEffect(() => {
    if (searchQuery) {
      geocodeLocation(searchQuery).then((newLocation) => {
        if (newLocation) setLocation(newLocation);
      });
    }
  }, [searchQuery]);

  // Events abrufen, wenn sich der Suchbegriff ändert
  useEffect(() => {
    setLoading(true);
    fetchEvents(searchQuery)
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Fehler beim Laden der Events");
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <Router>
      <AccessibilityToolbar />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar onSearch={setSearchQuery} />
              {loading ? (
                <p>⏳ Events werden geladen...</p>
              ) : error ? (
                <p>❌ {error}</p>
              ) : (
                <>
                  <Map events={events} location={location} />
                  <EventList events={events} />
                </>
              )}
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="/spenden" element={<SpendenPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
