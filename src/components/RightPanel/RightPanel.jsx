import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './RightPanel.css'; // Import the CSS file for styling

const RightPanel = ({ 
  handleScreenshot, 
  selectedStars, 
  removeStar, 
  resetConstellations,
  isOpen, 
  setIsOpen,
  setSelectedStars // New function prop to update selectedStars
}) => {
  // Default nodesCount value
  const [nodesCount, setNodesCount] = useState(0); 

  // Update nodesCount whenever selectedStars changes
  useEffect(() => {
    setNodesCount(selectedStars.length);
  }, [selectedStars]);

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle the Reset button click
  const handleReset = () => {
    resetConstellations(); // Call the reset function passed in as prop
    setSelectedStars([]); // Reset selectedStars to an empty array
  };

  return (
    <div className={`right-panel ${isOpen ? 'open' : 'closed'}`}>
      {/* Display content based on nodesCount */}
      {nodesCount > 2 && (
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

      {/* Selected Stars List */}
      <h3>Selected Stars</h3>
      <ul className="selected-stars-list">
        {selectedStars.map((star, index) => (
          <li key={index}>
            <span>{star}</span>
            <button onClick={() => removeStar(star)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

RightPanel.propTypes = {
  handleScreenshot: PropTypes.func.isRequired,
  selectedStars: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  removeStar: PropTypes.func.isRequired,
  resetConstellations: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setSelectedStars: PropTypes.func.isRequired, // New prop type for setSelectedStars
};

export default RightPanel;