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
    <form onSubmit={handleSearch} className="form-inline my-2 my-lg-0">
      <input
        type="text"
        className="form-control mr-sm-2"
        placeholder="Postleitzahl oder Ort"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Suchen</button>
    </form>
  );
};

export default SearchBar;
