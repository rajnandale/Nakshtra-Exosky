import { useState, useEffect } from 'react';
import './SearchBar.css';
import PropTypes from 'prop-types';
import { setViewPlanet } from '../../global'; // Import global variable setter

const SearchBar = ({ onSearch }) => { // Add onSearch prop
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]); // Initialize as an empty array to store fetched planet names
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch exoplanet names from the backend when the component mounts
  useEffect(() => {
    const fetchExoplanetNames = async () => {
      try {
        const response = await fetch('https://exoskyapi.vercel.app/get_planets_names'); // Replace with your API URL
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json(); // Parse the response as JSON
        setOptions(data); // Set the options with the fetched planet names
      } catch (error) {
        console.error('Error fetching exoplanet names:', error); // Log any errors
      }
    };
  
    fetchExoplanetNames(); // Call the function to fetch the data
  }, []);
  

  // Handle input changes for search functionality
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter options locally based on input
    if (value) {
      const filtered = options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  // Handle option click for dropdown search options
  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setFilteredOptions([]);
    setViewPlanet(option); // Update global variable
    onSearch(option); // Call onSearch with the selected option
  };

  // Handle search button click
  const handleSearch = () => {
    setViewPlanet(searchTerm); // Update global variable
    onSearch(searchTerm); // Call onSearch with the search term
  };

  // Toggle dropdown menu visibility for profile
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        {/* Dropdown populated with fetched planet names */}
        <select className="dropdown" value={searchTerm} onChange={handleInputChange}>
          <option value="">Select</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Search input */}
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>

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

// PropTypes validation
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // Add PropTypes validation for onSearch
};

export default SearchBar;