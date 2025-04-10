import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import EventList from "./EventList";
import api from "../api";

const eventIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684910.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

const RecenterAutomatically = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 12);
    }
  }, [lat, lon, map]);
  return null;
};

const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Map = ({ location }) => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [transportStops, setTransportStops] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.1657, 10.4515]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location?.length === 2) {
      setMapCenter(location);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setMapCenter([coords.latitude, coords.longitude]),
        (err) => console.warn("⚠️ Geolocation fehlgeschlagen:", err)
      );
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, locsRes, stopsRes] = await Promise.all([
          api.get("/api/events"),
          api.get("/api/locations"),
          api.get(`/api/public-transport?lat=${mapCenter[0]}&lon=${mapCenter[1]}`)
        ]);
        setEvents(eventsRes.data || []);
        setLocations(locsRes.data || []);
        setTransportStops(stopsRes.data || []);
      } catch (err) {
        setError("Daten konnten nicht geladen werden.");
        console.error("❌ Fehler beim Laden der Daten:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mapCenter]);

  useEffect(() => {
    if (events.length && mapCenter) {
      const filtered = events.filter((event) => {
        if (!event.lat || !event.lon) return false;
        const dist = haversineDistance(mapCenter, [parseFloat(event.lat), parseFloat(event.lon)]);
        return dist <= 50;
      });
      setNearbyEvents(filtered);
    }
  }, [events, mapCenter]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>⏳ Karten-Daten werden geladen...</p>}

      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }} key={mapCenter.join("-")}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterAutomatically lat={mapCenter[0]} lon={mapCenter[1]} />

        {nearbyEvents.map((event) => (
          <Marker
            key={event._id}
            position={[parseFloat(event.lat), parseFloat(event.lon)]}
            icon={eventIcon}
            eventHandlers={{ click: () => setSelectedEvent(event) }}
          >
            <Popup>
              <h3>{event.title}</h3>
              <p>{event.description || "Keine Beschreibung verfügbar."}</p>
              <p>📅 {event.date ? new Date(event.date).toLocaleDateString() : "Datum unbekannt"}</p>
              <p>🕒 {event.time || "Uhrzeit unbekannt"}</p>
              <p>📍 {event.street || "Unbekannte Straße"}, {event.city || "Unbekannte Stadt"}</p>
              <p>⭐ {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}</p>
              <p>♿ {event.accessibilityOptions?.length > 0 ? "Barrierefrei" : "Nicht barrierefrei"}</p>
              <p>👨‍👩‍👧‍👦 {event.suitableFor || "Keine Angabe"}</p>
            </Popup>
          </Marker>
        ))}

        {locations.map((loc) => (
          <Marker
            key={loc._id}
            position={[parseFloat(loc.geo.latitude), parseFloat(loc.geo.longitude)]}
            icon={locationIcon}
          >
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}

        {transportStops.map((stop) => (
          <Marker
            key={stop._id}
            position={[stop.lat, stop.lon]}
            icon={L.divIcon({
              className: "custom-transport-icon",
              html: `
                <div style="
                  background-color: ${stop.wheelchair ? '#4caf50' : '#f44336'};
                  color: white;
                  border-radius: 50%;
                  width: 36px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  border: 2px solid white;
                  box-shadow: 0 0 4px rgba(0,0,0,0.5);
                ">
                  ${stop.wheelchair ? "♿" : "🚫"}
                </div>
              `,
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36],
            })}
          >
            <Popup>
              🚉 <strong>{stop.name}</strong><br />
              ♿ {stop.wheelchair ? "Barrierefrei" : "Nicht barrierefrei"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {!loading && nearbyEvents.length > 0 && <EventList events={nearbyEvents} />}

      {!loading && nearbyEvents.length === 0 && (
        <p role="status" aria-live="polite" style={{ textAlign: "center", color: "gray", marginTop: "1rem" }}>
          🔍 Keine Events in deiner Nähe gefunden.
        </p>
      )}
    </div>
  );
};

export default Map;
