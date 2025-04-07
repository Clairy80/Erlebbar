import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchSavedEvents();
  }, []);

  return (
    <div className="saved-events-page">
      <h2>🌟 Meine gespeicherten Events</h2>
      {loading && <p>Lade gespeicherte Events...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && savedEvents.length === 0 && (
        <p role="status" aria-live="polite" style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "1rem" }}>
          🔍 Keine Events gefunden.
        </p>
      )}

      {!loading && !error && savedEvents.length > 0 && (
        <ul>
          {savedEvents.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description || "Keine Beschreibung verfügbar."}</p>
              <p>
                📅 {event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}
                {event.time && ` um ${event.time}`}
              </p>
              <p>📍 {event.city || "Ort nicht angegeben"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedEvents;
