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
        console.log("📡 Events & Locations werden geladen...");

        const [eventsRes, locationsRes] = await Promise.all([
          axios.get("/api/events"),
          axios.get("/api/locations"),
        ]);

        setEvents(eventsRes.data || []);
        setLocations(locationsRes.data || []);

        console.log("📍 Geladene Events:", eventsRes.data);
        console.log("📍 Geladene Locations:", locationsRes.data);

        // 🌍 Falls kein Suchort gesetzt wurde, auf erstes Event oder Location zentrieren
        if (eventsRes.data.length > 0 && eventsRes.data[0].lat && eventsRes.data[0].lon) {
          setMapCenter([eventsRes.data[0].lat, eventsRes.data[0].lon]);
        } else if (locationsRes.data.length > 0 && locationsRes.data[0].geo?.latitude && locationsRes.data[0].geo?.longitude) {
          setMapCenter([locationsRes.data[0].geo.latitude, locationsRes.data[0].geo.longitude]);
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>⏳ Karten-Daten werden geladen...</p>}

      {/* 🗺️ Map */}
      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }} role="application">
        <TileLayer attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterAutomatically lat={mapCenter[0]} lon={mapCenter[1]} />

        {/* 🔵 Events */}
        {events.length > 0 ? (
          events.map((event) =>
            event.lat && event.lon ? (
              <Marker key={event._id} position={[event.lat, event.lon]} icon={eventIcon}>
                <Popup>
                  <h3 tabIndex="0">{event.title || "Unbekanntes Event"}</h3>
                  <p>{event.description || "Keine Beschreibung verfügbar"}</p>
                  <p><strong>📍 Ort:</strong> {event.location || "Keine Adresse angegeben"}</p>
                  <p><strong>📅 Datum:</strong> {new Date(event.date).toLocaleDateString() || "Unbekannt"}</p>
                  <p><strong>🕒 Uhrzeit:</strong> {event.time || "Unbekannt"}</p>
                </Popup>
              </Marker>
            ) : null
          )
        ) : (
          <p>⚠️ Keine Events gefunden!</p>
        )}

        {/* 🔴 Locations */}
        {locations.length > 0 ? (
          locations.map((location) =>
            location.geo?.latitude && location.geo?.longitude ? (
              <Marker key={location._id} position={[location.geo.latitude, location.geo.longitude]} icon={locationIcon}>
                <Popup>
                  <h3 tabIndex="0">{location.name || "Unbekannte Location"}</h3>
                  <p>{location.description || "Keine Beschreibung verfügbar"}</p>
                  <p><strong>📍 Adresse:</strong> {location.address?.street && location.address?.zip && location.address?.city
                    ? `${location.address.street} ${location.address.number}, ${location.address.zip} ${location.address.city}`
                    : "Keine vollständige Adresse angegeben"
                  }</p>
                  <p><strong>🛠 Kategorie:</strong> {location.category || "Nicht angegeben"}</p>
               
               '   <p><strong>♿ Barrierefrei:</strong> {location.accessibility?.stepFreeAccess ? "Ja" : "Nein"}</p>
                </Popup>
              </Marker>
            ) : null
          )
        ) : (
          <p>⚠️ Keine Locations gefunden!</p>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
