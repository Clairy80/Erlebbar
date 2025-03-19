import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login fehlgeschlagen');
    }
  };

  return (
    <div className="login-container">
      <h2>🔑 Login</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="username">Benutzername:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <label htmlFor="password">Passwort:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">🚀 Anmelden</button>
      </form>
    </div>
  );
};

export default Login;
