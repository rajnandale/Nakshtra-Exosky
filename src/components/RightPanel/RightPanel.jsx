import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './RightPanel.css'; // Import the CSS file for styling

const RightPanel = ({ 
  handleScreenshot, 
  selectedStars, 
  removeStar, 
  resetConstellations = () => {}, // Default value for resetConstellations
  resetNewConnect = () => {}, // Default value for resetNewConnect
  isOpen, 
  setIsOpen,
  setSelectedStars, // New function prop to update selectedStars
  toggleDrawLines, // New prop to toggle drawLines state
  savedStars = [], // Default value for savedStars
  setSavedStars = () => {} // Default value for setSavedStars
}) => {
  const [nodesCount, setNodesCount] = useState(0);
  const [anotherConstellation, setAnotherConstellation] = useState(false); // New state for anotherConstellation

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
    setAnotherConstellation(false); // Set anotherConstellation to false
  };

  // Handle the Draw button click
  const handleDraw = () => {
    toggleDrawLines(); // Toggle drawLines prop
    setAnotherConstellation(true); // Set anotherConstellation to true
  };

  // Handle the New Connect button click
  const handleNewConnect = () => {
    setSavedStars([...savedStars, ...selectedStars]); // Save current selectedStars
    setSelectedStars([]); // Reset selectedStars
    resetNewConnect();
  };

  return (
    <div className={`right-panel ${isOpen ? 'open' : 'closed'}`}>
      {/* Display content based on nodesCount */}
      {nodesCount >= 2 && (
        <div>
          <button 
            className="screenshot-btn" 
            onClick={handleScreenshot}
          >
            Save
          </button>

          <button 
            className="screenshot-btn" 
            onClick={handleDraw} // Update onClick to use handleDraw
          >
            Draw
          </button>

          {anotherConstellation && (
            <button 
              className="screenshot-btn" 
              onClick={handleNewConnect} // New button for New Connect
            >
              New Connect
            </button>
          )}

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
        {savedStars.map((star, index) => (
          <li key={index}>
            <span>{star}</span>
            <button disabled>Remove</button> {/* Disable remove button for saved stars */}
          </li>
        ))}
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
  resetConstellations: PropTypes.func,
  resetNewConnect: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setSelectedStars: PropTypes.func.isRequired, // New prop type for setSelectedStars
  toggleDrawLines: PropTypes.func.isRequired, // New prop for toggling drawLines
  savedStars: PropTypes.array, // New prop type for savedStars
  setSavedStars: PropTypes.func // New prop type for setSavedStars
};

export default RightPanel;