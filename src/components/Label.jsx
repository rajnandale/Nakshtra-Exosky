import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Label = ({ planetName, labelRef }) => {
  useEffect(() => {
    if (!labelRef.current) {
      const labelDiv = document.createElement('div');
      labelDiv.className = 'label';
      labelDiv.style.position = 'absolute';
      labelDiv.style.backgroundColor = 'white'; // Improved background color
      labelDiv.style.padding = '5px';
      labelDiv.style.borderRadius = '5px';
      labelDiv.style.opacity = '0.5';
      labelDiv.style.pointerEvents = 'none';
      labelDiv.style.display = 'none';
      document.body.appendChild(labelDiv);
      labelRef.current = labelDiv;
    }

    const labelDiv = labelRef.current;
    labelDiv.textContent = planetName || '';
    labelDiv.style.display = planetName ? 'block' : 'none';
    labelDiv.style.left = '50%';
    labelDiv.style.bottom = '20px';
    labelDiv.style.transform = 'translateX(-50%)';
  }, [planetName, labelRef]);

  return null; // No additional rendering
};

Label.propTypes = {
  planetName: PropTypes.string,
  labelRef: PropTypes.object.isRequired,
};

export default Label;
