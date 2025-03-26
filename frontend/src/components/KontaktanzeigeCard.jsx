import React from "react";

const KontaktanzeigeCard = ({ anzeige }) => {
  if (!anzeige) return null;

  const {
    title,
    description,
    location,
    date,
    contact,
    accessible,
    type,
  } = anzeige;

  return (
    <article
      className="kontaktanzeige-card"
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: "#555" }}>{description}</p>

      <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
        <li><strong>📍 Ort:</strong> {location || "Nicht angegeben"}</li>
        <li><strong>📅 Datum:</strong> {date ? new Date(date).toLocaleDateString() : "Unbekannt"}</li>
        <li><strong>📬 Kontakt:</strong> {contact || "Keine Kontaktdaten"}</li>
        <li><strong>♿ Barrierefrei:</strong> {accessible ? "Ja" : "Nein"}</li>
        <li><strong>🧭 Art:</strong> {type === "online" ? "Online" : "Vor Ort"}</li>
      </ul>
    </article>
  );
};

export default KontaktanzeigeCard;
