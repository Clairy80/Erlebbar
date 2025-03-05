import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // Dynamische API-URL

// 📍 Geocoding: Adresse in Koordinaten umwandeln
export const geocodeLocation = async (searchQuery) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      { headers: { "Accept-Language": "de" } }
    );

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return null;
  } catch (error) {
    console.error("Fehler beim Geocoding:", error);
    return null;
  }
};

// 🎭 **Events abrufen**
export const fetchEvents = async (searchQuery = "") => {
  try {
    const url = searchQuery ? `${API_URL}/events/search?q=${encodeURIComponent(searchQuery)}` : `${API_URL}/events`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Events:", error);
    return [];
  }
};

// 🏢 **Locations abrufen**
export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/locations`);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Locations:", error);
    return [];
  }
};

// ➕ **Neue Location erstellen (nur eingeloggte User)**
export const createLocation = async (locationData, token) => {
  try {
    const response = await axios.post(`${API_URL}/locations`, locationData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fehler beim Erstellen der Location:", error);
    return null;
  }
};

// 🔄 **Location aktualisieren (nur Ersteller/Admin)**
export const updateLocation = async (id, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/locations/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren der Location ${id}:`, error);
    return null;
  }
};

// ❌ **Location löschen (nur Ersteller/Admin)**
export const deleteLocation = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/locations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true };
  } catch (error) {
    console.error(`Fehler beim Löschen der Location ${id}:`, error);
    return { success: false, error: error.message };
  }
};
