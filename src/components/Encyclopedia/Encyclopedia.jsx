import './Encyclopedia.css'; // Import CSS for styling
import PropTypes from 'prop-types'; // Import PropTypes

const Encyclopedia = ({ planetInfo, onBack }) => {
  return (
    <div className="encyclopedia-container">
      <button className="back-btn" onClick={onBack}>
        Back
      </button>
      {planetInfo ? ( // Check if planetInfo is available
        <div className="encyclopedia-content">
          <h2 className="title">{planetInfo[0]?.pl_name || 'Planet Encyclopedia'}</h2>
          <h3>General Information</h3>
          <p>{planetInfo[0]?.description || 'No description available.'}</p>

          <h3>Physical Characteristics</h3>
          <ul>
            <li><strong>Right Ascension (RA):</strong> {planetInfo[0]?.ra || 'N/A'}</li>
            <li><strong>Declination (DEC):</strong> {planetInfo[0]?.dec || 'N/A'}</li>
            <li><strong>Distance:</strong> {planetInfo[0]?.sy_dist || 'N/A'} light years</li>
            <li><strong>Planet Mass:</strong> {planetInfo[0]?.pl_masse || 'N/A'} Earth masses</li>
            <li><strong>Orbital Semi-major Axis:</strong> {planetInfo[0]?.pl_orbsmax || 'N/A'} AU</li>
            <li><strong>Magnitude:</strong> {planetInfo[0]?.sy_gaiamag || 'N/A'}</li>
          </ul>

          {/* Add more sections as necessary */}
        </div>
      ) : (
        <p>Loading...</p>  // Display loading message while fetching data
      )}
    </div>
  );
};

Encyclopedia.propTypes = {
  planetInfo: PropTypes.array, // Ensure planetInfo is an array
  onBack: PropTypes.func.isRequired, // Ensures onBack is a function and required
};

export default Encyclopedia;
