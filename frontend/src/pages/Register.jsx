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
    date: '',
    time: '',
    eventType: 'Konzert',
    accessibilityOptions: []
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const accessibilityOptions = [
    'Rollstuhlgerecht',
    'Sehbehindertengerecht (Braille, Audio)',
    'Hörbehindertengerecht (Gebärdensprache)',
    'Neurodivergenzfreundlich'
  ];

  const eventTypes = ['Konzert', 'Vortrag', 'Workshop', 'Seminar', 'Festival'];

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
    try {
      console.log("Hallo Register");
      // Registrierungs-API ohne E-Mail-Verifizierung
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      alert(response.data.message);
      navigate('/login'); // Nach erfolgreicher Registrierung zum Login weiterleiten
    } catch (error) {
      console.log(error.response);
      setError(error.response?.data?.message || 'Fehler bei der Registrierung');
    }
  };

  return (
    <div className="form-container">
      <BackHomeButton />
      <h2>📝 Registrierung</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Benutzername</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Passwort (min. 6 Zeichen)</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-Mail</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rolle</label>
          <select 
            name="role" 
            id="role" 
            value={formData.role} 
            onChange={handleChange}
            required
          >
            <option value="user">👤 Teilnehmer*in</option>
            <option value="organizer">📅 Veranstalter*in</option>
          </select>
        </div>

        {formData.role === 'organizer' && (
          <>
            <div className="form-group">
              <label htmlFor="organization">Organisation</label>
              <input 
                type="text" 
                name="organization" 
                id="organization" 
                value={formData.organization} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresse</label>
              <input 
                type="text" 
                name="address" 
                id="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Datum</label>
              <input 
                type="date" 
                name="date" 
                id="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Uhrzeit</label>
              <input 
                type="time" 
                name="time" 
                id="time" 
                value={formData.time} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventType">Event-Typ</label>
              <select 
                name="eventType" 
                id="eventType" 
                value={formData.eventType} 
                onChange={handleChange}
                required
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
              />
              {option}
            </label>
          ))}
        </fieldset>

        <button type="submit" className="form-button">🚀 Registrieren</button>
      </form>
    </div>
  );
};

export default Register;
