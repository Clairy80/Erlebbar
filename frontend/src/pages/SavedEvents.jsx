import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const fetchSavedEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Du bist nicht eingeloggt. Bitte melde dich an.");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/users/saved-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedEvents(res.data || []);
    } catch (err) {
      setError("Fehler beim Laden deiner gespeicherten Events.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/unsave-event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Fehler beim Entfernen des Events:", error);
    }
  };

  const handleRatingChange = async (eventId, newRating) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/events/${eventId}/rate`, { rating: newRating }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSavedEvents();
    } catch (error) {
      console.error("Fehler beim Bewerten:", error);
    }
  };

  return (
    <div className="saved-events-page">
      <h2>🌟 Meine gespeicherten Events</h2>
      {loading && <p>Lade gespeicherte Events...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && savedEvents.length === 0 && (
        <p
          role="status"
          aria-live="polite"
          style={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          🔍 Keine Events gefunden.
        </p>
      )}

      {!loading && !error && savedEvents.length > 0 && (
        <ul className="saved-events" style={{ listStyle: "none", padding: 0 }}>
          {savedEvents.map((event) => (
            <li
              key={event._id}
              className="event-card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description || "Keine Beschreibung verfügbar."}</p>
              <p>
                📅 {event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}
                {event.time && ` um ${event.time}`}
              </p>
              <p>📍 {event.city || "Ort nicht angegeben"}</p>
              <p>
                ⭐ Bewertung:
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingChange(event._id, star)}
                    style={{
                      cursor: "pointer",
                      color: star <= event.rating ? "gold" : "#ccc",
                      fontSize: "1.5rem",
                    }}
                  >
                    ★
                  </span>
                ))}
              </p>
              <button
                className="event-save-button"
                onClick={() => handleUnsave(event._id)}
                style={{
                  marginTop: "0.8rem",
                  backgroundColor: "#ff6666",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ❌ Entfernen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedEvents;
