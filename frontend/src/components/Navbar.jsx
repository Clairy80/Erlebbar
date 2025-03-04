import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" aria-label="Hauptnavigation">
      {/* Brand-Logo / Titel */}
      <Link className="navbar-brand" to="/">Barrierefreie Events</Link>

      <button 
        className="navbar-toggler" 
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {/* Startseite (Home) */}
          <li className="nav-item active">
            <Link className="nav-link" to="/">Startseite</Link>
          </li>
          
          {/* Allgemeine Registrierung (für Veranstalter und User) */}
          <li className="nav-item">
            <Link className="nav-link" to="/register">Registrierung</Link>
          </li>

          {/* Login */}
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
