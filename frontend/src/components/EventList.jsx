import React, { useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const EventList = ({ events }) => {
  useEffect(() => {
    console.log("🎯 Empfangene Events in EventList:", events);
  }, [events]);

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
            background: '#fff'
          }}
          role="region"
          aria-labelledby={`event-title-${event._id}`}
        >
          <h3 id={`event-title-${event._id}`} style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>{event.description || "Keine Beschreibung verfügbar"}</p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FaCalendarAlt style={{ marginRight: '0.5rem', color: '#646cff' }} aria-hidden="true" />
            <span aria-label="Datum">{event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}</span>
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FaClock style={{ marginRight: '0.5rem', color: '#646cff' }} aria-hidden="true" />
            <span aria-label="Uhrzeit">{event.time || "Uhrzeit unbekannt"}</span>
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#646cff' }} aria-hidden="true" />
            <span aria-label="Ort">{event.location || "Ort unbekannt"}</span>
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '0.5rem', fontSize: "1.2rem" }}>⭐</span>
            <span aria-label="Bewertung">
              {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}
            </span>
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '0.5rem' }}>♿</span>
            <span aria-label="Barrierefreiheit">
              {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}
            </span>
          </p>

          <p style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '0.5rem' }}>👨‍👩‍👧‍👦</span>
            <span aria-label="Zielgruppe">{event.suitableFor || "Keine Angabe"}</span>
          </p>
        </article>
      ))}
    </section>
  );
};

export default EventList;
