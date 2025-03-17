import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations';

// 📍 **Neue Location erstellen**
export const createLocation = async (locationData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(API_URL, locationData, config);
    return response.data;
};

// 📍 **Alle Locations abrufen**
export const getAllLocations = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// 📍 **Eine Location abrufen**
export const getLocationById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// 📍 **Location aktualisieren**
export const updateLocation = async (id, updatedData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, updatedData, config);
    return response.data;
};

// 📍 **Location löschen**
export const deleteLocation = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};
