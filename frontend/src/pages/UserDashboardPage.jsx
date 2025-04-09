import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ Zentrales Axios-Setup

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("❌ Fehler beim Abrufen des Profils:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUnsave = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/users/unsave-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({
        ...prev,
        savedEvents: prev.savedEvents.filter((e) => e._id !== eventId),
      }));
    } catch (err) {
      console.error("❌ Fehler beim Entfernen des Events:", err);
    }
  };

  const [userRatings, setUserRatings] = useState({});
  const [ratingMessages, setRatingMessages] = useState({});
  
  const handleRating = async (eventId, rating) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/api/events/${eventId}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // ⭐ Stern-Anzahl für dieses Event merken
      setUserRatings((prev) => ({
        ...prev,
        [eventId]: rating,
      }));
  
      // 📣 Textnachricht anzeigen
      setRatingMessages((prev) => ({
        ...prev,
        [eventId]: `⭐ ${rating} Stern${rating === 1 ? '' : 'e'} gespeichert – ${getRatingLabel(rating)}`,
      }));
  
      // ⏳ Nach 3 Sekunden wieder ausblenden
      setTimeout(() => {
        setRatingMessages((prev) => {
          const updated = { ...prev };
          delete updated[eventId];
          return updated;
        });
      }, 3000);
    } catch (err) {
      console.error("❌ Bewertungsfehler:", err);
      setRatingMessages((prev) => ({
        ...prev,
        [eventId]: "❌ Bewertung konnte nicht gespeichert werden.",
      }));
    }
  };

  return (
    <div className="user-dashboard">
      <h2>📌 Dein Dashboard</h2>

      {loading ? (
        <p>⏳ Lade deine Daten...</p>
      ) : user ? (
        <>
          <p>Willkommen, <strong>{user.username}</strong>!</p>
          <p>📧 <span style={{ fontFamily: "monospace" }}>{user.email}</span></p>

          <h3>🌟 Deine gespeicherten Events</h3>
          {user.savedEvents?.length > 0 ? (
            <div className="saved-events">
              {user.savedEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p className="event-meta">
                    📅 {new Date(event.date).toLocaleDateString()}<br />
                    📍 {event.city || "Unbekannt"}<br />
                    ⏰ {event.time || "Keine Uhrzeit"}<br />
                    ♿ {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}
                  </p>
                  <div className="rating-stars" aria-label="Bewerte dieses Event">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`star ${star <= (userRatings[event._id] || 0) ? "active" : ""}`}
      title={`${star} Stern${star === 1 ? "" : "e"}: ${getRatingLabel(star)}`}
      onClick={() => handleRating(event._id, star)}
    >
      ★
    </span>
  ))}

  {ratingMessages[event._id] && (
    <p className="rating-message">{ratingMessages[event._id]}</p>
  )}
</div>

                  <button
                    className="unsave-button"
                    onClick={() => handleUnsave(event._id)}
                  >
                    ❌ Entfernen
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: "1rem", color: "gray" }}>⚠️ Keine gespeicherten Events.</p>
          )}

          <button
            className="form-button"
            onClick={handleLogout}
            style={{ maxWidth: "200px", margin: "2rem auto 0" }}
          >
            Abmelden
          </button>
        </>
      ) : (
        <p>⚠️ Fehler beim Laden des Profils.</p>
      )}
    </div>
  );
};

const getRatingLabel = (star) => {
  switch (star) {
    case 1: return "schlecht";
    case 2: return "geht so";
    case 3: return "okay";
    case 4: return "gut";
    case 5: return "super";
    default: return "";
  }
};

export default UserDashboardPage;
