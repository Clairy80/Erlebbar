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
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/api/users/saved-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedIds(res.data.map(event => event._id));
      } catch (err) {
        console.warn("⚠️ Konnte gespeicherte Events nicht laden:", err.response?.data?.message || err.message);
      }
    };

    fetchSaved();
  }, []);

  const toggleSaveEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bitte zuerst einloggen.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      if (savedIds.includes(eventId)) {
        await axios.delete(`/api/users/unsave-event/${eventId}`, { headers });
        setSavedIds(prev => prev.filter(id => id !== eventId));
      } else {
        await axios.put(`/api/users/save-event/${eventId}`, {}, { headers });
        setSavedIds(prev => [...prev, eventId]);
      }
    } catch (err) {
      console.error("❌ Fehler beim (Ent)Speichern:", err);
      alert("Etwas ist schiefgelaufen. Bitte später erneut versuchen.");
    }
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="event-list-heading"
      style={{
        marginTop: '1rem',
        textAlign: 'left',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}
    >
      <h2 id="event-list-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Verfügbare Events
      </h2>

      {events.map(event => (
        <article
          key={event._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            background: '#fff',
            position: 'relative'
          }}
          role="region"
          aria-labelledby={`event-title-${event._id}`}
        >
          <button
            onClick={() => toggleSaveEvent(event._id)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: savedIds.includes(event._id) ? "hotpink" : "#ccc",
              position: "absolute",
              top: "1rem",
              right: "1rem"
            }}
            aria-label={savedIds.includes(event._id) ? "Event gespeichert" : "Event speichern"}
            title={savedIds.includes(event._id) ? "Event gespeichert – klicken zum Entfernen" : "Event speichern"}
          >
            {savedIds.includes(event._id) ? "❤️" : "🤍"}
          </button>

          <h3 id={`event-title-${event._id}`} style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>
            {event.description || "Keine Beschreibung verfügbar"}
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FaCalendarAlt style={{ marginRight: '0.5rem', color: '#646cff' }} />
            {event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FaClock style={{ marginRight: '0.5rem', color: '#646cff' }} />
            {event.time || "Uhrzeit unbekannt"}
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#646cff' }} />
            {event.location || "Ort unbekannt"}
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '0.5rem', fontSize: "1.2rem" }}>⭐</span>
            {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '0.5rem' }}>♿</span>
            {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '0.5rem' }}>👨‍👩‍👧‍👦</span>
            {event.suitableFor || "Keine Angabe"}
          </p>
        </article>
      ))}
    </section>
  );
};

export default EventList;
