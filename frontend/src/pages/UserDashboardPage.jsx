import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      const response = await axios.get("/api/users/profile", {
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
      await axios.delete(`/api/users/unsave-event/${eventId}`, {
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

  const handleRating = async (eventId, rating) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/api/events/${eventId}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("⭐ Bewertung gespeichert!");
    } catch (err) {
      console.error("❌ Bewertungsfehler:", err);
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
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="star"
                        onClick={() => handleRating(event._id, star)}
                      >
                        ⭐
                      </span>
                    ))}
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

          <button className="form-button" onClick={handleLogout} style={{ maxWidth: "200px", margin: "2rem auto 0" }}>
            Abmelden
          </button>
        </>
      ) : (
        <p>⚠️ Fehler beim Laden des Profils.</p>
      )}
    </div>
  );
};

export default UserDashboardPage;
