import PropTypes from 'prop-types';
import './css/RightPanel.css'; // Import the CSS file for styling

const RightPanel = ({ 
  isConstellationMode, 
  setIsConstellationMode, 
  handleScreenshot, 
  drawConstellation,
  selectedPlanets, 
  removePlanet
}) => {

  // Toggle Constellation Mode button handler
  const toggleConstellationMode = () => {
    if (!isConstellationMode) {
      setIsConstellationMode(true);
      drawConstellation(); // Draw the constellation if it's being enabled
    } else {
      setIsConstellationMode(false);
    }
  };

  return (
    <div className="right-panel">
      <h2>Control Panel</h2>
      
      {/* Constellation Mode Button */}
      <button 
        className="constellation-mode-toggle" 
        onClick={toggleConstellationMode}
      >
        {isConstellationMode ? 'Disable Constellation Mode' : 'Enable Constellation Mode'}
      </button>

      {/* Draw Constellation Button */}
      <button 
        className="draw-constellation-btn" 
        onClick={drawConstellation}
      >
        Draw Constellation
      </button>

      {/* Screenshot Button */}
      <button 
        className="screenshot-btn" 
        onClick={handleScreenshot}
      >
        Take Screenshot
      </button>
      
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
  );
};

RightPanel.propTypes = {
  isConstellationMode: PropTypes.bool.isRequired,
  setIsConstellationMode: PropTypes.func.isRequired,
  handleScreenshot: PropTypes.func.isRequired,
  drawConstellation: PropTypes.func.isRequired,
  selectedPlanets: PropTypes.array.isRequired,
  removePlanet: PropTypes.func.isRequired,
};

export default RightPanel;