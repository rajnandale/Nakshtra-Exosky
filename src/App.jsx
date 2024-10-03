import { useEffect, useState } from 'react';
import './App.css';
import ExoplanetPlot from './components/ExoplanetPlot.jsx';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';
import { ViewPlanet, setViewPlanet } from './global'; // Import global variable and setter

const App = () => {
  const [exoplanetData, setExoplanetData] = useState([]);
  const [starData, setStarData] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(ViewPlanet); // Initialize with global variable

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
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    setSelectedPlanet(ViewPlanet); // Update selected planet when global variable changes
  }, [ViewPlanet]);

  const handlePlanetClick = (planetName) => {
    setViewPlanet(planetName); // Update global variable
    setSelectedPlanet(planetName); // Update local state
  };

  return (
    <div className="app-container">
      <SearchBar onSearch={handlePlanetClick} /> {/* Pass search handler to SearchBar */}
      <Sidebar selectedPlanet={selectedPlanet} /> {/* Pass selected planet to Sidebar */}
      <div className="exoplanet-plot-section">
        <ExoplanetPlot 
          exoplanetData={exoplanetData} 
          starData={starData} 
          onPlanetClick={handlePlanetClick} // Pass click handler to ExoplanetPlot
          selectedPlanet={selectedPlanet} // Pass selected planet to ExoplanetPlot
        />
      </div>
    </div>
  );
};

export default App;