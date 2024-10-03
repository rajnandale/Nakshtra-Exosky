import { useState, useEffect } from 'react';
import './Sidebar.css'; // Import the CSS for styling
import PropTypes from 'prop-types';
import { ViewPlanet } from '../../global'; // Import global variable

const Sidebar = ({ selectedPlanet }) => {
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
        // Show Encyclopedia content when button is clicked
        <div className="encyclopedia-container">
          <button className="back-btn" onClick={handleBackToSidebar}>
            Back
          </button>
          {/* {planetInfo ? (
            <pre>{JSON.stringify(planetInfo, null, 2)}</pre> // Display raw JSON data
          ) : (
            <p>Loading...</p>
          )} */}
         {planetInfo ? (
  <div className="planet-info">
    <h3 className="planet-name">{planetInfo[0]?.pl_name}</h3>
    <div className="planet-details">
      <p><span className="detail-label">Right Ascension (RA):</span> {planetInfo[0]?.ra}</p>
      <p><span className="detail-label">Declination (DEC):</span> {planetInfo[0]?.dec}</p>
      <p><span className="detail-label">Distance:</span> {planetInfo[0]?.sy_dist} light years</p>
      <p><span className="detail-label">Planet Mass:</span> {planetInfo[0]?.pl_masse} Earth masses</p>
      <p><span className="detail-label">Orbital Semi-major Axis:</span> {planetInfo[0]?.pl_orbsmax} AU</p>
      <p><span className="detail-label">Magnitude:</span> {planetInfo[0]?.sy_gaiamag}</p>
    </div>
  </div>
) : (
  <p>Loading...</p>
)}

        </div>
      ) : (
        // Show default sidebar content when Encyclopedia is not open
        <div className="sidebar-content">
          <h2>{ViewPlanet || 'SUN'}</h2> {/* Display selected planet or default to SUN */}
          <h3>YELLOW DWARF</h3>
          <div className="menu-items">
            <button className="menu-item">VISIT</button>
            <button className="menu-item" onClick={openEncyclopedia}>ENCYCLOPEDIA</button> {/* Open Encyclopedia */}
            <button className="menu-item">STRUCTURE</button>
          </div>
          {/* <div className="icons">
            <div className="menu-item">SWITCH PLANET</div>
            <div className="menu-item">NIGHT SKY</div>
            <div className="menu-item">SOLAR SYSTEM</div>
          </div> */}
        </div>
      )}

      {/* Sidebar Toggle Button */}
      <div className="arrow-button" onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </div>
    </div>
  );
};

// PropTypes validation
Sidebar.propTypes = {
  selectedPlanet: PropTypes.string, // Add PropTypes validation for selectedPlanet
};

export default Sidebar;