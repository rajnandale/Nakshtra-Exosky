import PropTypes from 'prop-types';
import { useState } from 'react';
import './RightPanel.css'; // Import the CSS file for styling

const RightPanel = ({ 
  handleScreenshot, 
  selectedPlanets, 
  removePlanet, 
  resetConstellations,
  isOpen, 
  setIsOpen,
  setNodesCount // New function prop to update nodesCount
}) => {
  // Default nodesCount value
  const [nodesCount, setLocalNodesCount] = useState(0); 

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle the Reset button click
  const handleReset = () => {
    resetConstellations(); // Call the reset function passed in as prop
    setLocalNodesCount(0); // Reset nodesCount to zero
  };

  return (
    <>
      <div className={`right-panel ${isOpen ? 'open' : 'closed'}`}>
        {/* Display content based on nodesCount */}
        {nodesCount === 2 && (
          <div>
            <button 
              className="screenshot-btn" 
              onClick={handleScreenshot}
            >
              Save
            </button>

            <button 
              className="screenshot-btn"
              onClick={handleReset} // Update onClick to use handleReset
            >
              Reset
            </button>
          </div>
        )}
        
        {nodesCount === 0 && (
          <p>" !! Click on star ** </p>
        )}

        {nodesCount === 1 && (
          <p>Connect to other star</p>
        )}

        {/* Selected Planets List */}
        <h3>Selected Planets</h3>
        <ul className="selected-planets-list">
          {selectedPlanets.map((planet, index) => (
            <li key={index}>
              <span>{planet}</span>
              <button onClick={() => removePlanet(planet)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

RightPanel.propTypes = {
  handleScreenshot: PropTypes.func.isRequired,
  selectedPlanets: PropTypes.array.isRequired,
  removePlanet: PropTypes.func.isRequired,
  resetConstellations: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default RightPanel;
