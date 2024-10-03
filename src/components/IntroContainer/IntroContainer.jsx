import { useState } from 'react';
import PropTypes from 'prop-types';
import '../IntroContainer/IntroContainer.css';

const IntroContainer = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      imageSrc: '/src/textures/other/man2.png',
      description: 'This is the first page description with relevant information.',
    },
    {
      imageSrc: '/src/textures/other/man3.png',
      description: 'This is the second page description with different content.',
    },
    {
      imageSrc: '/src/textures/other/man4.png',
      description: 'This is the third page with additional details.',
    },
  ];

  // Handle navigation between pages
  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="intro-container">
      <img 
        src={pages[currentPage].imageSrc} 
        alt={`Intro ${currentPage + 1}`} 
        className="intro-image" 
      />
      <div className="image-info">
        {pages[currentPage].description}
      </div>
      <div className="button-container">
        <button 
          className="previous-button" 
          onClick={handlePrevious}
          disabled={currentPage === 0} // Disable if on the first page
        >
          Previous
        </button>
        <button 
          className="next-button" 
          onClick={handleNext}
          disabled={currentPage === pages.length - 1} // Disable if on the last page
        >
          Next
        </button>
      </div>
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

IntroContainer.propTypes = {
  onClose: PropTypes.func.isRequired, // Prop validation for onClose
};

export default IntroContainer;
