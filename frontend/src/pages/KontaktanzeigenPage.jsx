import React, { useState, useEffect } from "react";
import axios from "axios";

const KontaktanzeigenPage = () => {
  const [anzeigen, setAnzeigen] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnzeigen = async () => {
      try {
        const res = await axios.get("/api/kontaktanzeigen");
        setAnzeigen(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Kontaktanzeigen:", err);
        setError("Kontaktanzeigen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnzeigen();
  }, []);

  return (
    <section style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🤝 Begleitgesuche & Kontaktanzeigen</h1>

      {loading && <p>⏳ Kontaktanzeigen werden geladen...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {anzeigen.length === 0 ? (
        <p>🔍 Noch keine Anzeigen vorhanden.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {anzeigen.map((anzeige) => (
            <article
              key={anzeige._id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <h2 style={{ marginBottom: "0.5rem" }}>{anzeige.title}</h2>
              <p>{anzeige.description}</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
                📍 Ort: {anzeige.location || "Nicht angegeben"}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                🕒 Für Datum: {anzeige.date ? new Date(anzeige.date).toLocaleDateString() : "Offen"}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                👤 Kontakt: {anzeige.contact || "Keine Angabe"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default KontaktanzeigenPage;
