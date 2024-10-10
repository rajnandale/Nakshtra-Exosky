import { useEffect, useState, useRef } from 'react';
import './App.css';
import ExoplanetPlot from './components/ExoplanetPlot.jsx';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';
import { ViewPlanet, setViewPlanet } from './global';
import IntroContainer from './components/IntroContainer/IntroContainer.jsx';
import RightPanel from './components/RightPanel/RightPanel.jsx';
import { useSelectedStars } from './SelectedStarsContext';

// Import images
import loadingImage from '/src/assets/rocket_loading.png';
import drawIcon from '/src/assets/constillation.png';

const App = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL; // Centralized API URL constant
  const [exoplanetData, setExoplanetData] = useState([]);
  const [starData, setStarData] = useState([]);
  const [exoplanetNames, setExoplanetNames] = useState([]); // New state for planet names
  const [selectedPlanet, setSelectedPlanet] = useState(ViewPlanet);
  const [dataReady, setDataReady] = useState(false);
  const [plotReady, setPlotReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [drawMode, setDrawMode] = useState(false);
  const [drawLines, setDrawLines] = useState(false); // New state for drawLines
  const [isRightPanelVisible, setRightPanelVisible] = useState(false);
  const { selectedStars, setSelectedStars } = useSelectedStars();

  const resetConstellationPointsRef = useRef(null);
  const resetNewConnectRef = useRef(null);

  const handleClose = () => {
    setShowIntro(false);
  };

  // Centralized data fetching logic
  useEffect(() => {
    const fetchExoplanetData = async () => {
      try {
        const response = await fetch(`${apiUrl}/get_objects`);
        const data = await response.json();

        const exoplanetData = data.filter(item => item.object_type === 'exoplanet').map(planet => ({
          planet_name: planet.name,
          x: planet.x,
          y: planet.y,
          z: planet.z,
        }));
        setExoplanetData(exoplanetData);

        const starData = data.filter(item => item.object_type === 'star').map(star => ({
          star_name: star.name,
          x: star.x,
          y: star.y,
          z: star.z,
        }));
        setStarData(starData);
        setDataReady(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchExoplanetNames = async () => {
      try {
        const response = await fetch(`${apiUrl}/get_planets_names`);
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.localeCompare(b));
        setExoplanetNames(sortedData);
      } catch (error) {
        console.error('Error fetching exoplanet names:', error);
      }
    };

    fetchExoplanetData();
    fetchExoplanetNames();
  }, [apiUrl]);

  useEffect(() => {
    setSelectedPlanet(ViewPlanet);
  }, [ViewPlanet]);

  const handlePlanetClick = (planetName) => {
    setViewPlanet(planetName);
    setSelectedPlanet(planetName);
  };

  const toggleDrawMode = () => {
    setDrawMode(!drawMode);
    setRightPanelVisible(!isRightPanelVisible);
  };

  const toggleDrawLines = () => {
    setDrawLines(!drawLines);
  };

  const handleResetConstellations = () => {
    if (resetConstellationPointsRef.current) {
      resetConstellationPointsRef.current();
    }
    setSelectedStars([]);
  };

  const handleResetNewConnect = () => {
    if (resetNewConnectRef.current) {
      resetNewConnectRef.current();
    }
  };

  return (
    <>
      <div className={`app-container ${showIntro ? 'blur-background' : ''}`}>
        <SearchBar 
          onSearch={handlePlanetClick} 
          setDataReady={setDataReady} 
          exoplanetNames={exoplanetNames} 
        />
        {/* <button className="draw-button" onClick={toggleDrawMode}>
          <img src={drawIcon} alt="Draw Mode" />
        </button> */}
        {!dataReady ? (
          <div className="loading-container">
            <img src={loadingImage} alt="Loading..." />
          </div>
        ) : (
          <>
            <Sidebar selectedPlanet={selectedPlanet} />
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
                toggleDrawMode={toggleDrawMode}
                drawLines={drawLines} 
                resetConstellationPointsRef={resetConstellationPointsRef}
                resetNewConnectRef={resetNewConnectRef}
              />
            </div>
            {/* <RightPanel 
              handleScreenshot={() => {}} 
              selectedStars={selectedStars} 
              removeStar={(star) => setSelectedStars(selectedStars.filter(s => s !== star))} 
              resetConstellations={handleResetConstellations} 
              resetNewConnect={handleResetNewConnect} 
              isOpen={isRightPanelVisible} 
              setIsOpen={setRightPanelVisible} 
              setSelectedStars={setSelectedStars} 
              toggleDrawLines={toggleDrawLines} 
            /> */}
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
