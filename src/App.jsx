import { useEffect, useState, useRef } from 'react';
import './App.css';
import ExoplanetPlot from './components/ExoplanetPlot.jsx';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';
import { ViewPlanet, setViewPlanet } from './global';
import IntroContainer from './components/IntroContainer/IntroContainer.jsx';
import RightPanel from './components/RightPanel/RightPanel.jsx';
import loadingImage from './assets/rocket_loading.png';
import drawIcon from './assets/constillation.png';
import { useSelectedStars } from './SelectedStarsContext';

const App = () => {
  const [exoplanetData, setExoplanetData] = useState([]);
  const [starData, setStarData] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(ViewPlanet);
  const [dataReady, setDataReady] = useState(false);
  const [plotReady, setPlotReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [drawMode, setDrawMode] = useState(false);
  const [drawLines, setDrawLines] = useState(false); // New state for drawLines
  const [isRightPanelVisible, setRightPanelVisible] = useState(false);
  const { selectedStars, setSelectedStars } = useSelectedStars();
  
  // Using ref to keep reference to the reset function in ExoplanetPlot
  const resetConstellationPointsRef = useRef(null);
  const resetNewConnectRef = useRef(null);

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

  const toggleDrawLines = () => {
    setDrawLines(!drawLines); // Toggles drawLines state
  };

  const handleResetConstellations = () => {
    if (resetConstellationPointsRef.current) {
      resetConstellationPointsRef.current(); // Calls the function from ExoplanetPlot
    }
    setSelectedStars([]); // Clear selected stars
  };

  const handleResetNewConnect = () => {
    if (resetNewConnectRef.current) {
      resetNewConnectRef.current(); // Calls the function from ExoplanetPlot
    }
  };

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
            <div className="exoplanet-plot-section">
              {!plotReady ? (
                <div className="loading-container">
                  <img src={loadingImage} alt="Loading plot..." />
                </div>
              ) : null}
              <ExoplanetPlot 
                exoplanetData={exoplanetData} 
                starData={starData} 
                onPlanetClick={handlePlanetClick} 
                setPlotReady={setPlotReady} 
                selectedStars={selectedStars} 
                setSelectedStars={setSelectedStars} 
                drawMode={drawMode} 
                drawLines={drawLines} 
                resetConstellationPointsRef={resetConstellationPointsRef} // Pass ref to ExoplanetPlot
                resetNewConnectRef={resetNewConnectRef}
              />
            </div>
            <RightPanel 
              handleScreenshot={() => {}} 
              selectedStars={selectedStars} 
              removeStar={(star) => setSelectedStars(selectedStars.filter(s => s !== star))} 
              resetConstellations={handleResetConstellations} // Call reset function
              resetNewConnect={handleResetNewConnect} // Call reset function
              isOpen={isRightPanelVisible} 
              setIsOpen={setRightPanelVisible} 
              setSelectedStars={setSelectedStars} 
              toggleDrawLines={toggleDrawLines} 
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