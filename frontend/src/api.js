// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // 🔧 Backend-Adresse
  headers: {
    "Content-Type": "application/json",
  },
});

// 🛡️ Optional: Token automatisch setzen
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

