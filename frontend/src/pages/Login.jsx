import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        identifier,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.href = '/';
    } catch (err) {
      console.error('❌ Login-Fehler:', err);
      setError(err.response?.data?.message || 'Login fehlgeschlagen');
    }
  };

  return (
    <div className="form-container">
      <h2>🔑 Login</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="identifier">Benutzername oder E-Mail:</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Passwort:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="form-button">
          🚀 Anmelden
        </button>
      </form>
    </div>
  );
};

export default Login;
