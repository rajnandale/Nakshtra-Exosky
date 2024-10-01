import { useEffect, useState } from 'react';
import ExoplanetPlot from './components/ExoplanetPlot.jsx';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';

const App = () => {
  const [exoplanetData, setExoplanetData] = useState([]);
  const [starData, setStarData] = useState([]);

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

  return (
    <div className="app-container">
      <SearchBar />
      <Sidebar />
      <div className="exoplanet-plot-section">
        <ExoplanetPlot exoplanetData={exoplanetData} starData={starData} />
      </div>
    </div>
  );
};

export default App;