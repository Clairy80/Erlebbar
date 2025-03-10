import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";

// 🔵 Blaue Marker für Events
const eventIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

// 🔴 Rote Marker für Locations
const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684910.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

// 🌍 **Map automatisch zentrieren**
const RecenterAutomatically = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 12);
    }
  }, [lat, lon, map]);
  return null;
};

const Map = ({ location }) => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.1657, 10.4515]); // 🇩🇪 Standard: Deutschland

  // 🛠 API-Daten abrufen
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventsRes, locationsRes] = await Promise.all([
          axios.get("/api/events"),
          axios.get("/api/locations"),
        ]);

        setEvents(eventsRes.data || []);
        setLocations(locationsRes.data || []);

        // 🌍 Falls kein Suchort gesetzt wurde, auf erstes Event oder Location zentrieren
        if (eventsRes.data.length > 0) {
          setMapCenter([eventsRes.data[0].lat, eventsRes.data[0].lon]);
        } else if (locationsRes.data.length > 0) {
          setMapCenter([locationsRes.data[0].lat, locationsRes.data[0].lon]);
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der Events oder Locations:", err);
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 📍 Wenn ein neuer Standort gesucht wird, aktualisiere `mapCenter`
  useEffect(() => {
    if (location) {
      setMapCenter(location);
    }
  }, [location]);

  return (
    <div>
      {/* 🗺️ Map */}
      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }} role="application">
        <TileLayer attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterAutomatically lat={mapCenter[0]} lon={mapCenter[1]} />

        {/* 🔵 Events */}
        {events.map((event) =>
          event.lat && event.lon ? (
            <Marker key={event._id} position={[event.lat, event.lon]} icon={eventIcon}>
              <Popup>
                <h3 tabIndex="0">{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>📍 Ort:</strong> {event.location}</p>
              </Popup>
            </Marker>
          ) : null
        )}

        {/* 🔴 Locations */}
        {locations.map((location) =>
          location.lat && location.lon ? (
            <Marker key={location._id} position={[location.lat, location.lon]} icon={locationIcon}>
              <Popup>
                <h3 tabIndex="0">{location.name}</h3>
                <p>{location.description}</p>
                <p><strong>Barrierefrei:</strong> {location.accessible ? "Ja" : "Nein"}</p>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
