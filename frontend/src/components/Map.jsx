import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import EventList from "./EventList";
import api from "../api"; // 🔄 Dein zentrales Axios-Setup

const eventIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684910.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
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
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [transportStops, setTransportStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.1657, 10.4515]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bitte zuerst einloggen, um Events zu speichern.");
        return;
      }

      await api.put(`/api/users/save-event/${eventId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("🎉 Event wurde gespeichert!");
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      alert("Fehler beim Speichern. Bitte versuch es später erneut.");
    }
  };

  useEffect(() => {
    if (location && location.length === 2) {
      setMapCenter(location);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.warn("⚠️ Geolocation fehlgeschlagen oder blockiert:", error);
        }
      );
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventsRes, locationsRes, stopsRes] = await Promise.all([
          api.get("/api/events"),
          api.get("/api/locations"),
          api.get(`/api/public-transport?lat=${mapCenter[0]}&lon=${mapCenter[1]}`)
        ]);

        setEvents(eventsRes.data || []);
        setLocations(locationsRes.data || []);
        setTransportStops(stopsRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mapCenter]);

  useEffect(() => {
    if (events.length && mapCenter) {
      const filteredEvents = events.filter((event) => {
        const distance = haversineDistance(mapCenter, [parseFloat(event.lat), parseFloat(event.lon)]);
        return distance <= 50;
      });
      setNearbyEvents(filteredEvents);
    }
  }, [events, mapCenter]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>⏳ Karten-Daten werden geladen...</p>}
      
      <MapContainer center={mapCenter} key={mapCenter.join("-")} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
              <p>📍 {event.location || "Ort unbekannt"}</p>
              <p>⭐ {event.rating ? `${event.rating} Sterne` : "Noch keine Bewertung"}</p>
              <p>♿ {event.accessible ? "Barrierefrei" : "Nicht barrierefrei"}</p>
              <p>👨‍👩‍👧‍👦 {event.suitableFor || "Keine Angabe"}</p>
              <button
                onClick={() => handleSaveEvent(event._id)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.3rem 0.6rem",
                  backgroundColor: "#646cff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                💾 Event speichern
              </button>
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
        <p
          role="status"
          aria-live="polite"
          style={{ color: "red", textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}
        >
          🔍 Keine Events in deiner Nähe gefunden.
        </p>
      )}
    </div>
  );
};

export default Map;