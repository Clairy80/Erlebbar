import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Diese Komponente zentriert die Karte automatisch, wenn sich die Koordinaten ändern
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};

const Map = ({ events, location }) => {
  // Standardposition: Wenn kein Standort vorhanden, verwende einen Default-Wert
  const defaultPosition = location ? [location.lat, location.lng] : [51.505, -0.09];

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Falls ein Standort vorhanden ist, zentriert RecenterAutomatically die Karte */}
      {location && <RecenterAutomatically lat={location.lat} lng={location.lng} />}
      {events && events.map(event => (
        <Marker key={event._id} position={[event.lat, event.lon]}>
          <Popup>
            <div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
