// src/components/EventList.jsx
import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return <p>Keine Events gefunden.</p>;
  }

  return (
    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
      <h3>Verfügbare Events</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(event => (
          <li key={event.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#646cff', fontSize: '1.5rem' }} />
            <div>
              <strong>{event.title}</strong><br />
              {event.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
