import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AccessibilityToolbar from "./components/AccessibilityToolbar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Map from "./components/Map.jsx";
import EventList from "./components/EventList.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ImpressumPage from "./pages/ImpressumPage.jsx";
import DatenschutzPage from "./pages/DatenschutzPage.jsx";
import OrganizerDashboardPage from "./components/OrganizerDashboardPage.jsx";
import UserDashboardPage from "./pages/UserDashboardPage.jsx";
import KontaktanzeigeForm from "./components/KontaktanzeigeForm.jsx";
import SavedEvents from "./pages/SavedEvents.jsx";
import SpendenPage from "./pages/SpendenPage.jsx";
import WelcomeHeader from './components/WelcomeHeader.jsx';

import "leaflet/dist/leaflet.css";
import { geocodeLocation, fetchEvents } from "./api/api";
import "./index.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(!!localStorage.getItem("token"));
  const [error, setError] = useState(null);

  // 🌍 **Automatische Standortbestimmung**
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        () => console.log("Standortbestimmung nicht möglich")
      );
    }
  }, [location]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setSearchQuery(query);

    try {
      const newLocation = await geocodeLocation(query);
      if (newLocation) {
        setLocation(newLocation);
      } else {
        console.error("📍 Standort nicht gefunden.");
      }
    } catch (error) {
      console.error("Fehler bei Standortsuche:", error);
    }
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents(searchQuery);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
      }
    };

    if (searchQuery) {
      fetchAllEvents();
    }
  }, [searchQuery]);

  return (
    <Router>
      <AccessibilityToolbar />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <WelcomeHeader />
                <SearchBar onSearch={handleSearch} />
                <Map location={location} events={events} />
                <EventList events={events} searchQuery={searchQuery} />
              </>
            }
          />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/veranstalter" element={user ? <OrganizerDashboardPage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <UserDashboardPage /> : <Navigate to="/login" />} />
          <Route path="/saved-events" element={user ? <SavedEvents /> : <Navigate to="/login" />} />
          <Route path="/kontaktanzeigen" element={<KontaktanzeigeForm />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/spenden" element={<SpendenPage />} />

          {/* 🔴 Fehlerseite (404) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
