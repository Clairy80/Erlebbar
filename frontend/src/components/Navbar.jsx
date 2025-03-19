import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="Hauptnavigation">
      {/* 🌍 Erlebbar Branding */}
      <h1>🌍 Erlebbar</h1>

      {/* 🔗 Navigation */}
      <ul>
        <li>
          <Link to="/" aria-label="Startseite">
            <FaHome /> Start
          </Link>
        </li>
        <li>
          <Link to="/login" aria-label="Login für registrierte Benutzer">
            <FaSignInAlt /> Login
          </Link>
        </li>
        <li>
          <Link to="/register" aria-label="Registrierung für neue Benutzer">
            <FaUserPlus /> Registrieren
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
