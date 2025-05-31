import React from 'react';
import './linear.css';
const SearchValueInput = ({ searchValue, setSearchValue }) => {
  return (
    <div className="controls">
      <h3>Key</h3>
      <input
        type="number"
        placeholder="Search value"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="search-value-input"
      />
    </div>
  );
};

export default SearchValueInput;
