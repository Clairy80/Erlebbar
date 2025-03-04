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
    eventType: 'Konzert', // Standardwert für Eventtyp
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

  const eventTypes = ['Konzert', 'Vortrag', 'Workshop', 'Seminar', 'Festival']; // Eventtypen

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
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Registrierung</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Benutzername" value={formData.username} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="password" name="password" placeholder="Passwort (min. 6 Zeichen)" value={formData.password} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 mb-2 border rounded">
          <option value="user">Teilnehmer*in</option>
          <option value="organizer">Veranstalter*in</option>
        </select>
        {formData.role === 'organizer' && (
          <>
            <input type="text" name="organization" placeholder="Name der Organisation" value={formData.organization} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <input type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full p-2 mb-2 border rounded">
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </>
        )}
        <fieldset className="mb-4">
          <legend className="font-semibold">Barrierefreiheit</legend>
          {accessibilityOptions.map(option => (
            <label key={option} className="block">
              <input type="checkbox" value={option} checked={formData.accessibilityOptions.includes(option)} onChange={() => handleCheckboxChange(option)} className="mr-2" />
              {option}
            </label>
          ))}
        </fieldset>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Registrieren</button>
      </form>
    </div>
  );
};

export default Register;
