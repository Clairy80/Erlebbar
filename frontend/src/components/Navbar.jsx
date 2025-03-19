import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="Hauptnavigation">
      {/* 🌍 Erlebbar Branding */}
      <h1 className="navbar-brand">🌍 Erlebbar</h1>

      {/* 🔗 Navigation */}
      <ul className="navbar-links">
        <li>
          <Link to="/" className="nav-link" aria-label="Startseite">
            <FaHome /> Start
          </Link>
        </li>
        <li>
          <Link to="/login" className="nav-link" aria-label="Login für registrierte Benutzer">
            <FaSignInAlt /> Login
          </Link>
        </li>
        <li>
          <Link to="/register" className="nav-link" aria-label="Registrierung für neue Benutzer">
            <FaUserPlus /> Registrieren
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
