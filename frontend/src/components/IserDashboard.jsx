import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const UserDashboard = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/api/users/saved-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavedEvents(response.data);
      } catch (error) {
        console.error("❌ Fehler beim Laden der gespeicherten Events:", error);
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleUnsave = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/unsave-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("❌ Fehler beim Entfernen:", error);
    }
  };

  return (
    <div className="user-dashboard">
      <h2>📌 Dein Dashboard</h2>

      {loading ? (
        <p>⏳ Lade deine gespeicherten Events...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : savedEvents.length === 0 ? (
        <p>Du hast noch keine Events gespeichert.</p>
      ) : (
        <div className="saved-events">
          {savedEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 className="event-title">{event.title}</h3>
                <button
                  className="event-save-button"
                  onClick={() => handleUnsave(event._id)}
                  title="Event entfernen"
                >
                  <FaHeart />
                </button>
              </div>
              <p className="event-meta">
                📅 {new Date(event.date).toLocaleDateString()}<br />
                📍 {event.city || event.location || "Ort nicht angegeben"}<br />
                🕒 {event.time || "Uhrzeit unbekannt"}<br />
                ⭐ {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}<br />
                ♿ {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}<br />
                👨‍👩‍👧‍👦 {event.suitableFor || "Keine Angabe"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
