import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const BackHomeButton = () => (
  <Link to="/" className="back-home-link">
    <FontAwesomeIcon icon={faHome} /> Startseite
  </Link>
);

export default BackHomeButton;
