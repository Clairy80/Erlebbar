import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    if (location) {
      onSearch(location);
    }
  };

  return (
    <form onSubmit={handleSearch} aria-label="Suchleiste zur Standortsuche">
      <label htmlFor="location-search" className="sr-only">Standort suchen</label>
      <input
        id="location-search"
        type="text"
        placeholder="Postleitzahl oder Ort"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        aria-describedby="search-help"
      />
      <button type="submit">Suchen</button>
      <p id="search-help" className="sr-only">Geben Sie einen Ort oder eine PLZ ein und drücken Sie Enter</p>
    </form>
  );
};

export default SearchBar;