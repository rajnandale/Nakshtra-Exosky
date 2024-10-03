// import './Encyclopedia.css'; // Import CSS for styling
// import PropTypes from 'prop-types'; // Import PropTypes

// const Encyclopedia = ({ onBack }) => {
//   return (
//     <div className="encyclopedia-container">
//       <button className="back-btn" onClick={onBack}>
//         Back
//       </button>
//       <h2 className="title">Sun (Yellow Dwarf)</h2>
//       <div className="encyclopedia-content">
//         <h3>General Information</h3>
//         <p>The Sun, also referred to as Sol, is the star at the center of the Solar System. Its mass accounts for about 99.86% of the total mass of the Solar System.</p>

//         <h3>Physical Characteristics</h3>
//         <ul>
//           <li><strong>Equatorial Diameter:</strong> 1.39 million km</li>
//           <li><strong>Mass:</strong> 1.99 x 10<sup>30</sup> kg</li>
//           <li><strong>Galactic Center Distance:</strong> 26,038 light-years</li>
//           <li><strong>Rotation Period:</strong> 25 days</li>
//           <li><strong>Galactic Orbit Period:</strong> 225 million years</li>
//           <li><strong>Surface Gravity:</strong> 274 m/s²</li>
//           <li><strong>Surface Temperature:</strong> 5,778 K (5,505 °C)</li>
//         </ul>

//         <h3>Composition</h3>
//         <p>Roughly three-quarters of the Sun mass is hydrogen, with the rest mostly helium. Only about 600 of the remaining elements are present, including oxygen, carbon, neon, and iron.</p>
        
//         <h3>Importance</h3>
//         <p>The Sun is essential for life on Earth as it provides the necessary light and heat. It drives weather patterns and ocean currents.</p>
//       </div>
//     </div>
//   );
// };
// Encyclopedia.propTypes = {
//   onBack: PropTypes.func.isRequired, // Ensures onBack is a function and required
// };
// export default Encyclopedia;
import './Encyclopedia.css'; // Import CSS for styling
import PropTypes from 'prop-types'; // Import PropTypes

const Encyclopedia = ({ onBack, data }) => {
  const {
    dec,
    hostname,
    pl_masse,
    pl_name,
    pl_orbeccen,
    pl_orbincl,
    pl_orbper,
    pl_orbsmax,
    pl_rade,
    ra,
    sy_dist,
    sy_gaiamag
  } = data[0]; // Assuming you're passing the first object from the array

  return (
    <div className="encyclopedia-container">
      <button className="back-btn" onClick={onBack}>
        Back
      </button>
      <h2 className="title">{hostname}</h2>
      <div className="encyclopedia-content">
        <h3>Planetary Information</h3>
        <ul>
          <li><strong>Name:</strong> {pl_name || 'N/A'}</li>
          <li><strong>Mass (Earth Masses):</strong> {pl_masse || 'N/A'}</li>
          <li><strong>Semi-Major Axis (AU):</strong> {pl_orbsmax || 'N/A'}</li>
          <li><strong>Orbital Period (days):</strong> {pl_orbper || 'N/A'}</li>
          <li><strong>Orbital Eccentricity:</strong> {pl_orbeccen || 'N/A'}</li>
          <li><strong>Orbital Inclination (degrees):</strong> {pl_orbincl || 'N/A'}</li>
          <li><strong>Radius (Earth Radii):</strong> {pl_rade || 'N/A'}</li>
        </ul>

        <h3>Star Information</h3>
        <ul>
          <li><strong>Right Ascension (RA):</strong> {ra || 'N/A'}</li>
          <li><strong>Declination (DEC):</strong> {dec || 'N/A'}</li>
          <li><strong>Distance from Earth (Light Years):</strong> {sy_dist || 'N/A'}</li>
          <li><strong>Gaia Magnitude:</strong> {sy_gaiamag || 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
};

Encyclopedia.propTypes = {
  onBack: PropTypes.func.isRequired, // Ensures onBack is a function and required
  data: PropTypes.arrayOf(PropTypes.shape({
    dec: PropTypes.number,
    hostname: PropTypes.string,
    pl_masse: PropTypes.number,
    pl_name: PropTypes.string,
    pl_orbeccen: PropTypes.number,
    pl_orbincl: PropTypes.number,
    pl_orbper: PropTypes.number,
    pl_orbsmax: PropTypes.number,
    pl_rade: PropTypes.number,
    ra: PropTypes.number,
    sy_dist: PropTypes.number,
    sy_gaiamag: PropTypes.number
  })).isRequired, // Validate the structure of the data prop
};

export default Encyclopedia;
