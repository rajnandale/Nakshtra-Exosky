import './Encyclopedia.css'; // Import CSS for styling
import PropTypes from 'prop-types'; // Import PropTypes

const Encyclopedia = ({ onBack }) => {
  return (
    <div className="encyclopedia-container">
      <button className="back-btn" onClick={onBack}>
        Back
      </button>
      <h2 className="title">Sun (Yellow Dwarf)</h2>
      <div className="encyclopedia-content">
        <h3>General Information</h3>
        <p>The Sun, also referred to as Sol, is the star at the center of the Solar System. Its mass accounts for about 99.86% of the total mass of the Solar System.</p>

        <h3>Physical Characteristics</h3>
        <ul>
          <li><strong>Equatorial Diameter:</strong> 1.39 million km</li>
          <li><strong>Mass:</strong> 1.99 x 10<sup>30</sup> kg</li>
          <li><strong>Galactic Center Distance:</strong> 26,038 light-years</li>
          <li><strong>Rotation Period:</strong> 25 days</li>
          <li><strong>Galactic Orbit Period:</strong> 225 million years</li>
          <li><strong>Surface Gravity:</strong> 274 m/s²</li>
          <li><strong>Surface Temperature:</strong> 5,778 K (5,505 °C)</li>
        </ul>

        <h3>Composition</h3>
        <p>Roughly three-quarters of the Sun mass is hydrogen, with the rest mostly helium. Only about 600 of the remaining elements are present, including oxygen, carbon, neon, and iron.</p>
        
        <h3>Importance</h3>
        <p>The Sun is essential for life on Earth as it provides the necessary light and heat. It drives weather patterns and ocean currents.</p>
      </div>
    </div>
  );
};
Encyclopedia.propTypes = {
  onBack: PropTypes.func.isRequired, // Ensures onBack is a function and required
};
export default Encyclopedia;
