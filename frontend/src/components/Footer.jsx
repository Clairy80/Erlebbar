import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer 
      role="contentinfo"
      aria-label="Fußbereich"
      style={{
        marginTop: '2rem',
        padding: '1rem',
        borderTop: '1px solid #ccc',
        textAlign: 'center'
      }}
    >
      <p>&copy; 2025 Barrierefreie Events &amp; Locations</p>

      {/* Navigationsbereich mit ARIA-Label */}
      <nav aria-label="Rechtliche Links">
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <li>
            <Link to="/impressum" aria-label="Impressum (rechtliche Informationen)">Impressum</Link>
          </li>
          <li>
            <Link to="/datenschutz" aria-label="Datenschutzerklärung">Datenschutz</Link>
          </li>
          <li>
            <Link to="/spenden" aria-label="Spenden für barrierefreie Events">Spenden</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
