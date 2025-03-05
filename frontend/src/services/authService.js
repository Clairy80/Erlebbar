import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/users"; // Nutzt die API-URL aus der .env-Datei

// 🔐 **Benutzer registrieren**
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error.response?.data || error.message);
    throw error;
  }
};

// 🔑 **Benutzer einloggen**
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Speichert das Token
    }
    return response.data;
  } catch (error) {
    console.error("Fehler beim Login:", error.response?.data || error.message);
    throw error;
  }
};

// 🔄 **Benutzerprofil abrufen**
export const fetchUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fehler beim Abrufen des Profils:", error.response?.data || error.message);
    throw error;
  }
};

// 🚪 **Benutzer abmelden**
export const logoutUser = () => {
  localStorage.removeItem("token");
};
