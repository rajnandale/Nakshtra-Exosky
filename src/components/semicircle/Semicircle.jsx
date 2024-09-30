// import React from 'react';
import '../semicircle/semicircle.css'; // Import the corresponding CSS file
import earthImage from './04_earthcloudmap.jpg'; // Correct path to the image

const Semicircle = () => {
  return (
    <div className="semicircle-container">
      <img
        src={earthImage} // Use the imported image
        alt="Semicircular Earth"
        className="semicircle-image"
      />
    </div>
  );
};

export default Semicircle;