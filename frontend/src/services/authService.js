import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users'; // Passe die URL an dein Backend an

// Benutzer registrieren
export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Benutzer einloggen
export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

// Benutzerprofil abrufen
export const getProfile = async (token) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
