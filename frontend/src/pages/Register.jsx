import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackHomeButton from "../components/BackHomeButton";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    email: '',
    organization: '',
    address: '',
    eventType: 'Konzert',
    accessibilityOptions: [],
    eventTitle: '',
    eventDescription: '',
    eventDate: '',
    eventTime: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const accessibilityOptions = [
    'Rollstuhlgerecht',
    'Sehbehindertengerecht (Braille, Audio)',
    'Hörbehindertengerecht (Gebärdensprache)',
    'Neurodivergenzfreundlich'
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (option) => {
    setFormData(prevData => ({
      ...prevData,
      accessibilityOptions: prevData.accessibilityOptions.includes(option)
        ? prevData.accessibilityOptions.filter(item => item !== option)
        : [...prevData.accessibilityOptions, option]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      organization: formData.organization,
      address: formData.address,
      eventTitle: formData.eventTitle,
      eventDescription: formData.eventDescription,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      accessibilityOptions: formData.accessibilityOptions
    };

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', payload);
      alert(res.data.message || "🎉 Registrierung erfolgreich!");
      navigate('/login');
    } catch (error) {
      console.error("❌ Fehler bei Registrierung:", error.response?.data);
      setError(error.response?.data?.message || "Fehler bei der Registrierung");
    }
  };

  return (
    <div className="form-container">
      <BackHomeButton />
      <h2>📝 Registrierung</h2>
      {error && <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Benutzername</label>
          <input name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Passwort</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>E-Mail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Rolle</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">👤 Teilnehmer*in</option>
            <option value="organizer">📅 Veranstalter*in</option>
          </select>
        </div>

        {formData.role === 'organizer' && (
          <>
            <div className="form-group">
              <label>Organisation</label>
              <input name="organization" value={formData.organization} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Adresse (Straße, PLZ Ort)</label>
              <input name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Event-Titel</label>
              <input name="eventTitle" value={formData.eventTitle} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Event-Beschreibung</label>
              <input name="eventDescription" value={formData.eventDescription} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Datum</label>
              <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Uhrzeit</label>
              <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} required />
            </div>
          </>
        )}

        <fieldset className="form-group">
          <legend>♿ Barrierefreiheit</legend>
          {accessibilityOptions.map(option => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={formData.accessibilityOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              /> {option}
            </label>
          ))}
        </fieldset>

        <button type="submit" className="form-button">
          🚀 Registrieren
        </button>
      </form>
    </div>
  );
};

export default Register;
