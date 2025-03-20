import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/api/saved-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavedEvents(response.data);
      } catch (error) {
        console.error("❌ Fehler beim Laden der gespeicherten Events:", error);
      }
    };

    fetchSavedEvents();
  }, []);

  return (
    <div>
      <h1>📂 Mein Bereich</h1>
      {savedEvents.length === 0 ? (
        <p>Du hast noch keine Events gespeichert.</p>
      ) : (
        <ul>
          {savedEvents.map((event) => (
            <li key={event._id}>{event.title} - {event.date}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
