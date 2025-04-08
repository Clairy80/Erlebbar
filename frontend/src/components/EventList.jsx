import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';

const EventList = ({ events }) => {
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    console.log("🎯 Empfangene Events in EventList:", events);
  }, [events]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("/api/users/saved-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedIds(res.data.map(event => event._id));
      } catch (err) {
        console.warn("⚠️ Konnte gespeicherte Events nicht laden");
      }
    };
    fetchSaved();
  }, []);

  const toggleSaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bitte zuerst einloggen.");
        return;
      }

      if (savedIds.includes(eventId)) {
        setSavedIds(savedIds.filter(id => id !== eventId));
        // Optional: Delete-Funktion hier einbauen
      } else {
        await axios.put(`/api/users/save-event/${eventId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedIds([...savedIds, eventId]);
      }
    } catch (err) {
      console.error("❌ Fehler beim (Ent)Speichern:", err);
    }
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section
      className="event-list"
      aria-labelledby="event-list-heading"
    >
      <h2 id="event-list-heading" className="event-list-title">
        Verfügbare Events
      </h2>

      {events.map(event => (
        <article
          key={event._id}
          className="event-card"
          role="region"
          aria-labelledby={`event-title-${event._id}`}
        >
          <button
            onClick={() => toggleSaveEvent(event._id)}
            className={`event-save-button ${savedIds.includes(event._id) ? "saved" : ""}`}
            aria-label={savedIds.includes(event._id) ? "Event gespeichert" : "Event speichern"}
          >
            {savedIds.includes(event._id) ? "❤️" : "🤍"}
          </button>

          <h3 id={`event-title-${event._id}`} className="event-title">{event.title}</h3>
          <p className="event-description">{event.description || "Keine Beschreibung verfügbar"}</p>

          <p className="event-info"><FaCalendarAlt aria-hidden="true" /> {event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}</p>
          <p className="event-info"><FaClock aria-hidden="true" /> {event.time || "Uhrzeit unbekannt"}</p>
          <p className="event-info"><FaMapMarkerAlt aria-hidden="true" /> {event.location || "Ort unbekannt"}</p>
          <p className="event-info">⭐ {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}</p>
          <p className="event-info">♿ {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}</p>
          <p className="event-info">👨‍👩‍👧‍👦 {event.suitableFor || "Keine Angabe"}</p>
        </article>
      ))}
    </section>
  );
};

export default EventList;
