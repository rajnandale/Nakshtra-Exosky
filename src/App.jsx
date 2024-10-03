import { useEffect, useState } from 'react';
import './App.css';
import ExoplanetPlot from './components/ExoplanetPlot.jsx';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';
import { ViewPlanet, setViewPlanet } from './global';
import IntroContainer from './components/IntroContainer/IntroContainer.jsx';
import loadingImage from './components/IntroContainer/rocket_loading.png';

const App = () => {
  const [exoplanetData, setExoplanetData] = useState([]);
  const [starData, setStarData] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(ViewPlanet);
  const [dataReady, setDataReady] = useState(false);
  const [plotReady, setPlotReady] = useState(false); // New state for plot readiness

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

  const handlePlanetClick = (planetName) => {
    setViewPlanet(planetName);
    setSelectedPlanet(planetName);
  };

  return (
    <div className="app-container">
      <SearchBar onSearch={handlePlanetClick} setDataReady={setDataReady} />
      {!dataReady ? (
        <div className="loading-container">
          <img src={loadingImage} alt="Loading..." />
        </div>
      ) : (
        <>
          <Sidebar selectedPlanet={selectedPlanet} />
          <div className="exoplanet-plot-section">
            {!plotReady ? ( // Show loading until plot is ready
              <div className="loading-container">
                <img src={loadingImage} alt="Loading plot..." />
              </div>
            ) : null}
            <ExoplanetPlot 
              exoplanetData={exoplanetData} 
              starData={starData} 
              onPlanetClick={handlePlanetClick} 
              selectedPlanet={selectedPlanet} 
              setPlotReady={setPlotReady} // Pass setter for plot readiness
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
