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
        const token = localStorage.getItem("token"); // 🛡️ oder aus Context holen
        const res = await axios.get("/api/users/saved-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedEvents(res.data);
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
      {loading && <p>Lade...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {savedEvents.length === 0 ? (
        <p>Du hast noch keine Events gespeichert.</p>
      ) : (
        <ul>
          {savedEvents.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                📅 {new Date(event.date).toLocaleDateString()} um {event.time}
              </p>
              <p>📍 {event.city}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedEvents;
