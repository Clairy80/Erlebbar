import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/locations" || "http://localhost:5000/api/locations"; // Dynamische API-URL

// 📍 **Alle Locations abrufen**
export const fetchLocations = async () => {
  try {
    const response = await axios.get(API_URL);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Fehler beim Laden der Locations:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 📍 **Einzelne Location abrufen**
export const fetchLocationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Fehler beim Abrufen der Location ${id}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 🏗 **Neue Location erstellen (nur für eingeloggte User)**
export const createLocation = async (locationData, token) => {
  try {
    const response = await axios.post(API_URL, locationData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Fehler beim Erstellen der Location:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 🔄 **Bestehende Location aktualisieren (nur Ersteller/Admin)**
export const updateLocation = async (id, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Fehler beim Aktualisieren der Location ${id}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ❌ **Location löschen (nur Ersteller/Admin)**
export const deleteLocation = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Fehler beim Löschen der Location ${id}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
