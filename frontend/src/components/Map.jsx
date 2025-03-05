import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

// Blaue Marker für Events
const eventIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Rote Marker für Locations
const locationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684910.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Funktion zum Neuzentrieren der Karte
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};

const Map = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API-Daten abrufen
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, locationsRes] = await Promise.all([
          axios.get('/api/events'),
          axios.get('/api/locations')
        ]);

        setEvents(eventsRes.data);
        setLocations(locationsRes.data);
      } catch (err) {
        console.error('Fehler:', err);
        setError('Daten konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Standardposition
  const defaultPosition = [51.505, -0.09];

  if (loading) return <p role="status" aria-live="polite">⏳ Karte wird geladen...</p>;
  if (error) return <p role="alert" aria-live="assertive">❌ Fehler: {error}</p>;

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={13} 
      style={{ height: '500px', width: '100%' }}
      role="application" 
      aria-label="Interaktive Karte mit Events und barrierefreien Locations"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Events als blaue Marker */}
      {events.map(event => (
        <Marker 
          key={event._id} 
          position={[event.lat, event.lon]} 
          icon={eventIcon}
          aria-label={`Event: ${event.title}`}
        >
          <Popup>
            <h3 tabIndex="0">{event.title}</h3>
            <p>{event.description}</p>
          </Popup>
        </Marker>
      ))}

      {/* Locations als rote Marker */}
      {locations.map(location => (
        <Marker 
          key={location._id} 
          position={[location.lat, location.lon]} 
          icon={locationIcon}
          aria-label={`Location: ${location.name}, Barrierefreiheit: ${location.accessible ? "Ja" : "Nein"}`}
        >
          <Popup>
            <h3 tabIndex="0">{location.name}</h3>
            <p>{location.description}</p>
            <p><strong>Barrierefrei:</strong> {location.accessible ? "Ja" : "Nein"}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
