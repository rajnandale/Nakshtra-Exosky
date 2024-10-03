import { useState, useEffect } from 'react';
import './Sidebar.css'; // Import the CSS for styling
import Encyclopedia from '../Encyclopedia/Encyclopedia.jsx';  // Import the Encyclopedia component
import PropTypes from 'prop-types'; // Import PropTypes

const Sidebar = ({ selectedPlanet }) => {  // Add selectedPlanet as a prop
  const [isOpen, setIsOpen] = useState(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);  // New state to toggle Encyclopedia
  const [planetInfo, setPlanetInfo] = useState(null); // State to store planet info

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to open the Encyclopedia view
  const openEncyclopedia = () => {
    setShowEncyclopedia(true);
  };

  // Function to go back to the sidebar view from Encyclopedia
  const handleBackToSidebar = () => {
    setShowEncyclopedia(false);
  };

  // Fetch planet info when selectedPlanet changes
  useEffect(() => {
    if (selectedPlanet) {
      fetch(`https://exoskyapi.vercel.app/get_exoplanets_info?planet_name=${selectedPlanet}`)
        .then((response) => response.json())
        .then((data) => setPlanetInfo(data))
        .catch((error) => console.error('Error fetching planet info:', error));
    }
  }, [selectedPlanet]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {showEncyclopedia ? (
        <Encyclopedia planetInfo={planetInfo} onBack={handleBackToSidebar} />  // Pass planetInfo to Encyclopedia
      ) : (
        <div className="sidebar-content">
          <h2>{selectedPlanet || 'SUN'}</h2>  {/* Display selected planet or default to SUN */}
          <h3>YELLOW DWARF</h3>
          <div className="menu-items">
            <button className="menu-item">VISIT</button>
            <button className="menu-item" onClick={openEncyclopedia}>ENCYCLOPEDIA</button>
            <button className="menu-item">STRUCTURE</button>
          </div>
        </div>
      )}
      <div className="arrow-button" onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </div>
    </div>
  );
};

// PropTypes validation
Sidebar.propTypes = {
  selectedPlanet: PropTypes.string.isRequired, // Ensure selectedPlanet is required
};

export default Sidebar;
