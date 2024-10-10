import { useState } from 'react';
import './SearchBar.css';
import PropTypes from 'prop-types';
import { setViewPlanet } from '../../global';
import profileImage from '/src/assets/textures/other/profile_image.avif';

const SearchBar = ({ onSearch, setDataReady, exoplanetNames }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleOptionSelect = (option) => {
    setSearchTerm(option);
    setViewPlanet(option);
    onSearch(option);
  };

  const handleSearch = () => {
    setViewPlanet(searchTerm);
    onSearch(searchTerm);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <select 
          className="dropdown" 
          value={searchTerm} 
          onChange={(e) => handleOptionSelect(e.target.value)}
        >
          <option value="">Select</option>
          {exoplanetNames.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div>
          <img
            src={profileImage}
            className="profile-pic"
            onClick={toggleDropdown}
            alt="Profile"
          />
          {isDropdownOpen && (
            <div className="sub-menu-wrap">
              <div className="sub-menu">
                <div className="user-info">
                  <img
                    src={profileImage}
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
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  setDataReady: PropTypes.func.isRequired,
  exoplanetNames: PropTypes.array.isRequired, // Added prop type for exoplanetNames
};

export default SearchBar;
