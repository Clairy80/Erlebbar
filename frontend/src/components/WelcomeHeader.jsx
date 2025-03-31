import React from 'react';
import '../index.css';
import headerImage from '../pictures/inklusion.png';

const WelcomeHeader = () => {
  return (
    <header className="welcome-header">
      <div className="header-content">
        <div className="header-text">
          <h2>🌟 Barrierefreie Events für alle!</h2>
          <p>Finde Events, die Spaß machen – ohne Hindernisse.</p>
        </div>
        <img src={headerImage} alt="Barrierefrei" className="header-image"/>
      </div>
    </header>
  );
};

export default WelcomeHeader;
