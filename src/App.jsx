import { useEffect, useState } from 'react';
import './App.css';
import ExoplanetPlot from './components/ExoplanetPlot.jsx';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';
import { ViewPlanet, setViewPlanet } from './global';
import IntroContainer from './components/IntroContainer/IntroContainer.jsx';
import RightPanel from './components/RightPanel/RightPanel.jsx';
import loadingImage from './assets/rocket_loading.png';
import drawIcon from './assets/constillation.png';

const App = () => {
  const [exoplanetData, setExoplanetData] = useState([]);
  const [starData, setStarData] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(ViewPlanet);
  const [dataReady, setDataReady] = useState(false);
  const [plotReady, setPlotReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [drawMode, setDrawMode] = useState(false);
  const [isRightPanelVisible, setRightPanelVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility
  const [selectedStars, setSelectedStars] = useState([]); // New state for selected stars

  const handleClose = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    fetch('https://exoskyapi.vercel.app/get_objects')
      .then((response) => response.json())
      .then((data) => {
        const exoplanetData = data
          .filter((item) => item.object_type === 'exoplanet')
          .map((planet) => ({
            planet_name: planet.name,
            x: planet.x,
            y: planet.y,
            z: planet.z,
          }));
        setExoplanetData(exoplanetData);

        const starData = data
          .filter((item) => item.object_type === 'star')
          .map((star) => ({
            star_name: star.name,
            x: star.x,
            y: star.y,
            z: star.z,
          }));
        setStarData(starData);
        setDataReady(true);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    setSelectedPlanet(ViewPlanet);
  }, [ViewPlanet]);

  // Handle planet clicks
  const handlePlanetClick = (planetName) => {
    setViewPlanet(planetName);
    setSelectedPlanet(planetName);
  };

  const toggleDrawMode = () => {
    setDrawMode(!drawMode);
    setRightPanelVisible(!isRightPanelVisible);
  };

  // New function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Handle keydown events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        toggleSidebar(); // Open the sidebar
      } else if (event.key === 'ArrowLeft') {
        toggleSidebar(); // Close the sidebar
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className={`app-container ${showIntro ? 'blur-background' : ''}`}>
        <SearchBar onSearch={handlePlanetClick} setDataReady={setDataReady} />
        <button className="draw-button" onClick={toggleDrawMode}>
          <img src={drawIcon} alt="Draw Mode" />
        </button>
        {!dataReady ? (
          <div className="loading-container">
            <img src={loadingImage} alt="Loading..." />
          </div>
        ) : (
          <>
            {/* <Sidebar selectedPlanet={selectedPlanet} isOpen={isSidebarOpen} /> Pass isOpen to Sidebar */}
            <div className="exoplanet-plot-section">
              {!plotReady ? (
                <div className="loading-container">
                  <img src={loadingImage} alt="Loading plot..." />
                </div>
              ) : null}
              {/* Uncomment when ready to use */}
              <ExoplanetPlot 
                exoplanetData={exoplanetData} 
                starData={starData} 
                onPlanetClick={handlePlanetClick} 
                selectedPlanet={selectedPlanet} 
                setPlotReady={setPlotReady} 
                selectedStars={selectedStars} // Pass selectedStars to ExoplanetPlot
                setSelectedStars={setSelectedStars} // Pass setSelectedStars to ExoplanetPlot
                drawMode={drawMode} // Pass drawMode to ExoplanetPlot
              />
            </div>
            <RightPanel 
              handleScreenshot={() => {}} 
              selectedStars={selectedStars} // Pass selectedStars to RightPanel
              removeStar={(star) => setSelectedStars(selectedStars.filter(s => s !== star))} // Remove star from selectedStars
              resetConstellations={() => setSelectedStars([])} // Reset selectedStars
              isOpen={isRightPanelVisible} // Pass isOpen to RightPanel
              setIsOpen={setRightPanelVisible} // Pass setIsOpen to RightPanel
              setSelectedStars={setSelectedStars} // Pass setSelectedStars to RightPanel
            />
          </>
        )}
      </div>
      <div>
        {showIntro && (
          <IntroContainer onClose={handleClose} />
        )}
      </div>
    </>
  );
};

export default App;