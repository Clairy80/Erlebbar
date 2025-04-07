import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import EventList from "./EventList";

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

const Map = ({ location }) => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.1657, 10.4515]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (location && location.length === 2) {
      setMapCenter(location);
    }
  }, [location]);

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
      } catch (err) {
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>⏳ Karten-Daten werden geladen...</p>}

      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={mapCenter[0]} lon={mapCenter[1]} />

        {events.map((event) => (
          <Marker
            key={event._id}
            position={[parseFloat(event.lat), parseFloat(event.lon)]}
            icon={eventIcon}
            eventHandlers={{ click: () => setSelectedEvent(event) }}
          >
            <Popup>{event.title}</Popup>
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
      </MapContainer>

      {selectedEvent && <EventList events={[selectedEvent]} />}
    </div>
  );
};

export default Map;
