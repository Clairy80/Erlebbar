import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      marginTop: '2rem',
      padding: '1rem',
      borderTop: '1px solid #ccc',
      textAlign: 'center'
    }}>
      <p>&copy; 2024 Barrierefreie Events &amp; Locations</p>
      <div style={{ margin: '0.5rem 0' }}>
        <Link to="/impressum" style={{ marginRight: '1rem' }}>Impressum</Link>
        <Link to="/datenschutz" style={{ marginRight: '1rem' }}>Datenschutz</Link>
        <Link to="/spenden">Spenden</Link>
      </div>
    </footer>
  );
};

export default Footer;
