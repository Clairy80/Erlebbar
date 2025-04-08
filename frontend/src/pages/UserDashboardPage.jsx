import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Fehler beim Abrufen des Nutzerprofils");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("❌ Fehler:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>📌 Dein Dashboard</h1>
      {user ? (
        <>
          <p>Willkommen, {user.username}!</p>
          <p>📧 Email: {user.email}</p>
          <h2>🌟 Deine gespeicherten Events</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {user.savedEvents && user.savedEvents.length > 0 ? (
              user.savedEvents.map((event) => (
                <li key={event._id}>{event.title}</li>
              ))
            ) : (
              <li key="no-events">⚠️ Keine gespeicherten Events.</li>
            )}
          </ul>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Abmelden
          </button>
        </>
      ) : (
        <p>⏳ Lade deine Daten...</p>
      )}
    </div>
  );
};

export default UserDashboardPage;
