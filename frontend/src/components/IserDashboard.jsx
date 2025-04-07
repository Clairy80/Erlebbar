import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="dashboard-container" style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>📂 Mein Bereich</h1>

      {loading ? (
        <p>⏳ Lade deine gespeicherten Events...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : savedEvents.length === 0 ? (
        <p>Du hast noch keine Events gespeichert.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {savedEvents.map((event) => (
            <li
              key={event._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ margin: 0 }}>{event.title}</h3>
              <p style={{ margin: "0.5rem 0" }}>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>📍 {event.city || event.location || "Ort nicht angegeben"}</p>
              <p>🕒 {event.time || "Uhrzeit unbekannt"}</p>
              <p>⭐ {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}</p>
              <p>♿ {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}</p>
              <p>👨‍👩‍👧‍👦 {event.suitableFor || "Keine Angabe"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
