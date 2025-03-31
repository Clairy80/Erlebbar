import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import EventList from "./EventList";

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
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventsRes, locationsRes] = await Promise.all([
          axios.get("/api/events"),
          axios.get("/api/locations"),
        ]);

        const ratedEvents = await Promise.all(
          eventsRes.data.map(async (event) => {
            let avgRating = null;
            try {
              const ratingsRes = await axios.get(`/api/ratings/event/${event._id}`);
              const ratings = ratingsRes.data;
              avgRating =
                ratings.length > 0
                  ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                  : null;
            } catch (error) {
              if (error.response && error.response.status === 404) {
                console.info(`ℹ️ Keine Bewertungen für Event ${event._id} vorhanden.`);
              } else {
                console.warn(`⚠️ Fehler beim Abrufen der Bewertungen für Event ${event._id}:`, error);
              }
            }
        
            return { ...event, averageRating: avgRating };
          })
        );
        

        setEvents(ratedEvents || []);
        setLocations(locationsRes.data || []);

        if (ratedEvents.length > 0 && ratedEvents[0].lat && ratedEvents[0].lon) {
          setMapCenter([ratedEvents[0].lat, ratedEvents[0].lon]);
        }
      } catch (err) {
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location) {
      setMapCenter(location);
    }
  }, [location]);

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
            <Marker
              key={event._id}
              position={[event.lat, event.lon]}
              icon={eventIcon}
              eventHandlers={{ click: () => setSelectedEvent(event) }}
            >
              <Popup>{event.title}</Popup>
            </Marker>
          ) : null
        )}

        {/* 🔴 Locations anzeigen */}
        {locations.map((location) =>
          location.geo?.latitude && location.geo?.longitude ? (
            <Marker
              key={location._id}
              position={[location.geo.latitude, location.geo.longitude]}
              icon={locationIcon}
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Detailbereich direkt unter der Karte */}
      {selectedEvent && <EventList events={[selectedEvent]} />}
    </div>
  );
};

export default Map;