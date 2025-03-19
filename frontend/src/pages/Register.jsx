import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5001/api/users/register', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Fehler bei der Registrierung');
    }
  };

  return (
    <div className="register-container">
      <h2>📝 Registrierung</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="username" placeholder="Benutzername" value={formData.username} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Passwort (min. 6 Zeichen)" value={formData.password} onChange={handleChange} required />

        <label htmlFor="role">Rolle:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">👤 Teilnehmer*in</option>
          <option value="organizer">📅 Veranstalter*in</option>
        </select>

        {formData.role === 'organizer' && (
          <>
            <input type="text" name="organization" placeholder="Name der Organisation" value={formData.organization} onChange={handleChange} required />

            <input type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} required />

            <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} required />

            <input type="date" name="date" value={formData.date} onChange={handleChange} required />

            <input type="time" name="time" value={formData.time} onChange={handleChange} required />

            <label htmlFor="eventType">Event-Typ:</label>
            <select name="eventType" value={formData.eventType} onChange={handleChange}>
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </>
        )}

        <fieldset>
          <legend>♿ Barrierefreiheit</legend>
          {accessibilityOptions.map(option => (
            <label key={option}>
              <input type="checkbox" value={option} checked={formData.accessibilityOptions.includes(option)} onChange={() => handleCheckboxChange(option)} />
              {option}
            </label>
          ))}
        </fieldset>

        <button type="submit">🚀 Registrieren</button>
      </form>
    </div>
  );
};

export default Register;
