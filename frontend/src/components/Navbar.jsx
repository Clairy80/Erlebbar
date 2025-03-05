import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav role="navigation" aria-label="Hauptnavigation" style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0 }}>
        <li><Link to="/" aria-label="Startseite">Start</Link></li>
        <li><Link to="/login" aria-label="Login für registrierte Benutzer">Login</Link></li>
        <li><Link to="/register" aria-label="Registrierung für neue Benutzer">Registrieren</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;