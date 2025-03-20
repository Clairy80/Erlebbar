import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔐 Prüfen, ob Nutzer eingeloggt ist
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, [navigate]);

  // 📦 Nutzerprofil abrufen
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Fehler beim Abrufen des Nutzerprofils");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("❌ Fehler:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>📌 Dein Dashboard</h1>
      {user ? (
        <>
          <p>Willkommen, {user.name}!</p>
          <p>📧 Email: {user.email}</p>
          <p>🌟 Deine gespeicherten Events</p>
          <ul>
            {user.savedEvents && user.savedEvents.length > 0 ? (
              user.savedEvents.map((event) => <li key={event._id}>{event.title}</li>)
            ) : (
              <p>⚠️ Keine gespeicherten Events.</p>
            )}
          </ul>
        </>
      ) : (
        <p>⏳ Lade deine Daten...</p>
      )}
    </div>
  );
};

export default UserDashboardPage;
