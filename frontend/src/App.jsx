import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/Searchbar.jsx';
import Map from './components/Map';
import EventList from './components/EventList';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ImpressumPage from './pages/ImpressumPage'; // Import der Impressum-Seite
import AccessibilityToolbar from './components/AccessibilityToolbar';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import DatenschutzPage from './pages/DatenschutzPage.jsx';
import SpendenPage from './pages/SpendenPage.jsx';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);

  // Automatische Standortsuche beim initialen Laden
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error('Fehler bei der Standortbestimmung:', error);
        }
      );
    }
  }, [location]);

  // handleSearch: Aktualisiert den searchQuery-State
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // useEffect für Geocoding: Wann immer sich searchQuery ändert, wird ein Geocoding-Call ausgeführt
  useEffect(() => {
    if (searchQuery) {
      const fetchGeocode = async () => {
        try {
          const geoResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
            { headers: { 'Accept-Language': 'de' } }
          );
          if (geoResponse.data && geoResponse.data.length > 0) {
            const firstResult = geoResponse.data[0];
            setLocation({
              lat: parseFloat(firstResult.lat),
              lng: parseFloat(firstResult.lon),
            });
          } else {
            console.warn("Kein Ergebnis für Geocoding gefunden.");
          }
        } catch (error) {
          console.error('Fehler beim Geocoding:', error);
        }
      };
      fetchGeocode();
    }
  }, [searchQuery]);

  // useEffect: Lädt Events basierend auf dem Suchbegriff
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = 'http://localhost:5001/api/events/search';
        if (searchQuery) {
          url += `?q=${encodeURIComponent(searchQuery)}`;
        }
        const response = await axios.get(url);
        setEvents(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Events:', error);
      }
    };
    fetchEvents();
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
              <SearchBar onSearch={handleSearch} />
              <Map events={events} location={location} />
              <EventList events={events} />
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
