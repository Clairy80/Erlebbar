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
import './index.css';

// ✅ Leaflet-Icons ohne `require()`
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
    if (!query.trim()) return;
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

  // 📅 **Events abrufen basierend auf Suchanfragen**
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
      <div className="app-container">
        <AccessibilityToolbar />
        
        <div className="content-container">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SearchBar onLocationSelect={setLocation} />
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
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
