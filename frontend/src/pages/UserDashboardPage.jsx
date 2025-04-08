import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Fehler beim Abrufen des Nutzerprofils");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("❌ Fehler:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
