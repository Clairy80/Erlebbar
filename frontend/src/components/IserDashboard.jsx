import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("events"); // Bonus: Tabs

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
    <div className="dashboard-container" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>👤 Mein Bereich</h1>

      {/* Bonus: Navigation für zukünftige Tabs */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setActiveTab("events")} className={activeTab === "events" ? "active-tab" : ""}>📂 Gespeicherte Events</button>
        <button onClick={() => setActiveTab("settings")} className={activeTab === "settings" ? "active-tab" : ""}>⚙️ Einstellungen</button>
      </div>

      {activeTab === "events" && (
        <>
          {loading ? (
            <p>⏳ Lade deine gespeicherten Events...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : savedEvents.length === 0 ? (
            <p>Du hast noch keine Events gespeichert. <Link to="/map">Hier entdecken</Link></p>
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
                  <Link to={`/events/${event._id}`} style={{ color: "blue", textDecoration: "underline" }}>
                    🔍 Details anzeigen
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {activeTab === "settings" && (
        <div>
          <h3>🚧 Einstellungen</h3>
          <p>Hier kannst du bald dein Profil bearbeiten, Passwort ändern oder dich abmelden.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
