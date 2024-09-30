import { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options] = useState([
    'Earth',
    'Sun',
    'Moon',
    'Mercury',
    'Jupiter',
    'Saturn',
  ]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle input changes for search functionality
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter options based on input
    if (value) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  // Handle option click for dropdown search options
  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setFilteredOptions([]);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        {/* Dropdown for celestial objects */}
        <select className="dropdown">
          <option value="">Select</option>
          <option value="Earth">Earth</option>
          <option value="Sun">Sun</option>
          <option value="Moon">Moon</option>
          <option value="Mercury">Mercury</option>
          <option value="Jupiter">Jupiter</option>
          <option value="Saturn">Saturn</option>
        </select>

        {/* Search input */}
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <button className="search-button">Search</button>

        {/* Profile section */}
        <div>
          <img
            src="src/textures/other/profile_image.avif"
            className="profile-pic"
            onClick={toggleDropdown}
            alt="Profile"
          />
          {/* Conditionally render dropdown menu */}
          {isDropdownOpen && (
            <div className="sub-menu-wrap">
              <div className="sub-menu">
                <div className="user-info">
                  <img
                    src="src/textures/other/profile_image.avif"
                    className="sub-menu-img"
                    alt="Profile"
                  />
                  <div className="pic-text">Yash - Yograj</div>
                </div>
                <hr />
                <div className="menu-item">My Constellation</div>
                <div className="menu-item">My Profile</div>
                <div className="menu-item">Logout</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown for filtered search options */}
      {filteredOptions.length > 0 && (
        <div className="dropdown-list">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;