import React, { useState } from "react";

const KontaktanzeigeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    date: "",
    message: "",
    accessibility: false,
    isOnline: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    setError("");
    onSubmit(formData);
    setFormData({
      name: "",
      email: "",
      city: "",
      date: "",
      message: "",
      accessibility: false,
      isOnline: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="kontaktanzeige-form">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="name">Name*</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="email">E-Mail*</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="city">Ort</label>
      <input
        type="text"
        id="city"
        name="city"
        value={formData.city}
        onChange={handleChange}
      />

      <label htmlFor="date">Datum</label>
      <input
        type="date"
        id="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />

      <label htmlFor="message">Nachricht*</label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <div style={{ margin: "1rem 0" }}>
        <label>
          <input
            type="checkbox"
            name="accessibility"
            checked={formData.accessibility}
            onChange={handleChange}
          />
          &nbsp; Ich suche eine barrierefreie Veranstaltung
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="isOnline"
            checked={formData.isOnline}
            onChange={handleChange}
          />
          &nbsp; Ich suche eine Online-Veranstaltung
        </label>
      </div>

      <button type="submit">📝 Kontaktanzeige aufgeben</button>
    </form>
  );
};

export default KontaktanzeigeForm;
