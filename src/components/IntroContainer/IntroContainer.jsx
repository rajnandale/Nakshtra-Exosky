import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../IntroContainer/IntroContainer.css';

// Import images
import nightsky1 from '/src/assets/intro/nightsky1-resized.png';
import exo3 from '/src/assets/intro/EXO3-resized.png';
import cons2 from '/src/assets/intro/cons2-resized.png';

const IntroContainer = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      imageSrc: nightsky1,
      description: `Look up at the night sky! From Earth, you'll see stars twinkling and maybe even a planet or two. 
                    There's always something amazing to spot. Let's start our sky adventure!`,
    },
    {
      imageSrc: exo3,
      description: `What if you were on a faraway planet? The sky might have two or more suns, or stars you’ve never seen before. 
                    Imagine what their sunsets would look like! Let's explore the skies from other worlds!`,
    },
    {
      imageSrc: cons2,
      description: `Stars make fun patterns called constellations. You can create your own too! 
                    Look at the stars, connect them in your mind, and name your new constellation. What will you come up with?`,
    },
  ];

  // Handle keyboard navigation between pages
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' && currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1);
      } else if (event.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length]);

  // Auto slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [pages.length]);

  // Manually handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="intro-container">
      <div className="arrow left-arrow" onClick={() => handlePageChange(currentPage > 0 ? currentPage - 1 : 0)}>
        &#9664;
      </div>

      <img 
        src={pages[currentPage].imageSrc} 
        alt={`Intro ${currentPage + 1}`} 
        className="intro-image" 
      />

      <div className="image-info">{pages[currentPage].description}</div>

      <div className="arrow right-arrow" onClick={() => handlePageChange(currentPage < pages.length - 1 ? currentPage + 1 : pages.length - 1)}>
        &#9654;
      </div>

      {/* Page dots */}
      <div className="page-dots">
        {pages.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentPage ? 'active' : ''}`} 
            onClick={() => handlePageChange(index)} 
          />
        ))}
      </div>

      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

IntroContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default IntroContainer;
