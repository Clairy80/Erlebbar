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

// 🌍 Map automatisch zentrieren
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
  const [mapCenter, setMapCenter] = useState([51.1657, 10.4515]); // Deutschland

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

        const ratedEvents = await Promise.all(
          eventsRes.data.map(async (event) => {
            let avgRating = null;
            try {
              const ratingsRes = await axios.get(`/api/ratings/event/${event._id}`);
              const ratings = Array.isArray(ratingsRes.data) ? ratingsRes.data : [];
              avgRating =
                ratings.length > 0
                  ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                  : null;
            } catch (err) {
              if (err.response && err.response.status === 404) {
                console.info(`ℹ️ Keine Bewertungen für Event ${event._id} – alles okay.`);
              } else {
                console.warn(`⚠️ Fehler beim Laden der Bewertungen für Event ${event._id}`, err.message);
              }
            }
        
            return { ...event, averageRating: avgRating };
          })
        );
        

        setEvents(ratedEvents || []);
        setLocations(locationsRes.data || []);

        if (ratedEvents.length > 0 && ratedEvents[0].lat && ratedEvents[0].lon) {
          setMapCenter([ratedEvents[0].lat, ratedEvents[0].lon]);
        } else if (
          locationsRes.data.length > 0 &&
          locationsRes.data[0].geo?.latitude &&
          locationsRes.data[0].geo?.longitude
        ) {
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

  useEffect(() => {
    if (location) {
      console.log("🔄 Neuer Standort wurde gesetzt:", location);
      setMapCenter(location);
    }
  }, [location]);

  console.log("📌 State-Werte vor Rendering (Events):", events);
  console.log("📌 State-Werte vor Rendering (Locations):", locations);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>⏳ Karten-Daten werden geladen...</p>}

      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }} role="application">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={mapCenter[0]} lon={mapCenter[1]} />

        {/* 🔵 Events anzeigen */}
        {events.map((event) =>
          event.lat && event.lon ? (
            <Marker key={event._id} position={[event.lat, event.lon]} icon={eventIcon}>
              <Popup>
                <h3 tabIndex="0">{event.title || "Unbekanntes Event"}</h3>
                <p>{event.description || "Keine Beschreibung verfügbar"}</p>
                <p><strong>📍 Ort:</strong> {event.city || "Keine Adresse angegeben"}</p>
                <p><strong>📅 Datum:</strong> {event.date ? new Date(event.date).toLocaleDateString() : "Unbekannt"}</p>
                <p><strong>🕒 Uhrzeit:</strong> {event.time || "Unbekannt"}</p>
                <p><strong>⭐ Bewertung:</strong> {event.averageRating ? `${event.averageRating} Sterne` : "Noch keine Bewertung"}</p>
                <p><strong>♿ Barrierefreiheit:</strong> {event.accessibilityOptions?.length > 0 ? "Ja" : "Nein"}</p>
                <p><strong>👨‍👩‍👧‍👦 Zielgruppe:</strong> {event.suitableFor || "Alle"}</p>
              </Popup>
            </Marker>
          ) : null
        )}

        {/* 🔴 Locations anzeigen */}
        {locations.map((location) =>
          location.geo?.latitude && location.geo?.longitude ? (
            <Marker key={location._id} position={[location.geo.latitude, location.geo.longitude]} icon={locationIcon}>
              <Popup>
                <h3 tabIndex="0">{location.name || "Unbekannte Location"}</h3>
                <p>{location.description || "Keine Beschreibung verfügbar"}</p>
                <p><strong>📍 Adresse:</strong> {location.address?.street && location.address?.zip && location.address?.city
                  ? `${location.address.street} ${location.address.number}, ${location.address.zip} ${location.address.city}`
                  : "Keine vollständige Adresse angegeben"}</p>
                <p><strong>🛠 Kategorie:</strong> {location.category || "Nicht angegeben"}</p>
                <p><strong>♿ Barrierefrei:</strong> {location.accessibility?.stepFreeAccess ? "Ja" : "Nein"}</p>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
