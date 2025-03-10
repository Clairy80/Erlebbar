import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SearchBar from './components/SearchBar.jsx';
import Map from './components/Map.jsx';
import EventList from './components/EventList.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ImpressumPage from './pages/ImpressumPage.jsx';
import AccessibilityToolbar from './components/AccessibilityToolbar.jsx';
import DatenschutzPage from './pages/DatenschutzPage.jsx';
import SpendenPage from './pages/SpendenPage.jsx';
import 'leaflet/dist/leaflet.css';
import { geocodeLocation, fetchEvents } from "./api/api";
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🌍 **Automatische Standortbestimmung**
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.warn('⚠️ Geolocation fehlgeschlagen oder blockiert:', error)
      );
    }
  }, [location]);

  // 🔍 **Geocoding-Funktion bei Suchanfragen**
  const handleSearch = async (query) => {
    if (!query.trim()) return; // ❌ Keine leeren Suchanfragen erlauben
    setSearchQuery(query);

    try {
      const newLocation = await geocodeLocation(query);
      if (newLocation) {
        setLocation(newLocation);
      } else {
        setError("📍 Standort nicht gefunden.");
      }
    } catch (err) {
      setError("❌ Fehler bei der Standortsuche.");
    }
  };

  // 📅 **Events basierend auf der Suche abrufen**
  useEffect(() => {
    const loadEvents = async () => {
      if (!searchQuery.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await fetchEvents(searchQuery);
        setEvents(fetchedEvents);
      } catch (err) {
        setError("❌ Fehler beim Laden der Events.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [searchQuery]);

  return (
    <Router>
      <AccessibilityToolbar />
      <Navbar />
      <SearchBar onLocationSelect={setLocation} /> {/* 🔍 Die Suchleiste bleibt global! */}
      
      <Routes>
        <Route
          path="/"
          element={
            <>
              {loading ? (
                <p>⏳ Events werden geladen...</p>
              ) : error ? (
                <p>{error}</p>
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
