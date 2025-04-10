import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';

const EventList = ({ events }) => {
  const [savedIds, setSavedIds] = useState([]);

  // 📦 Debug: Events anzeigen
  useEffect(() => {
    console.log("🎯 Empfangene Events in EventList:", events);
  }, [events]);

  // 💾 Gespeicherte Events vom Backend laden
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/users/saved-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const saved = res.data?.map(event => event._id) || [];
        setSavedIds(saved);
      } catch (err) {
        console.warn("⚠️ Konnte gespeicherte Events nicht laden", err);
      }
    };

    fetchSaved();
  }, []);

  // ❤️/🤍 speichern oder entfernen
  const toggleSaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bitte zuerst einloggen.");
        return;
      }

      if (savedIds.includes(eventId)) {
        // ❌ Event entfernen (optional: DELETE Route später)
        setSavedIds(savedIds.filter(id => id !== eventId));
      } else {
        await axios.put(`/api/users/save-event/${eventId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedIds([...savedIds, eventId]);
      }
    } catch (err) {
      console.error("❌ Fehler beim (Ent)Speichern:", err);
    }
  };

  if (!Array.isArray(events) || events.length === 0) {
    return <p style={{ color: "gray" }}>🚫 Keine Events gefunden.</p>;
  }

  return (
    <section className="event-list" aria-labelledby="event-list-heading">
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
            aria-label={
              savedIds.includes(event._id)
                ? "Event ist gespeichert – Zum Entfernen klicken"
                : "Event speichern"
            }
          >
            {savedIds.includes(event._id) ? "❤️" : "🤍"}
          </button>

          <h3 id={`event-title-${event._id}`} className="event-title">{event.title}</h3>
          <p className="event-description">{event.description || "Keine Beschreibung verfügbar"}</p>

          <p className="event-info">
            <FaCalendarAlt /> {event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}
          </p>

          <p className="event-info">
            <FaClock /> {event.time || "Uhrzeit unbekannt"}
          </p>

          <p className="event-info">
            <FaMapMarkerAlt /> {[event.street, event.postalCode, event.city].filter(Boolean).join(", ") || "Ort unbekannt"}
          </p>

          <p className="event-info">
            ⭐ {typeof event.rating === "number" ? `${event.rating.toFixed(1)} Sterne` : "Noch keine Bewertung"}
          </p>

          <p className="event-info">
            ♿ {Array.isArray(event.accessibilityOptions) && event.accessibilityOptions.length > 0
              ? event.accessibilityOptions.join(", ")
              : "Nicht barrierefrei"}
          </p>

          <p className="event-info">
            👨‍👩‍👧‍👦 {event.suitableFor || "Keine Angabe"}
          </p>
        </article>
      ))}
    </section>
  );
};

export default EventList;
