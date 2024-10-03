import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls.jsx';
import Semicircle from './semicircle/Semicircle.jsx';
import PropTypes from 'prop-types';
import { ViewPlanet, setViewPlanet } from '../global'; // Import global variable and setter

const CAMERA_INITIAL_POSITION = { x: 0, y: 0, z: 5 };
const PLANET_SCALE_FACTOR = 1;
const STAR_SCALE_FACTOR = 1000;

const ExoplanetPlot = ({ exoplanetData, starData, onPlanetClick }) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const exoplanetsRef = useRef([]);
  const starsRef = useRef([]);
  const labelRef = useRef(null);
  const [showSemicircle, setShowSemicircle] = useState(true);

  useEffect(() => {
    if (exoplanetData.length === 0 && starData.length === 0) return;

    initializeScene();
    return cleanupScene;
  }, [exoplanetData, starData]);

  useEffect(() => {
    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    plotExoplanets();
    plotStars().then(fetchAllStarsInfo).then(applyThemeToStars);
  }, [exoplanetData, starData]);

  useEffect(() => {
    if (ViewPlanet) {
      const selectedPlanet = exoplanetsRef.current.find(planet => planet.userData.planetName === ViewPlanet);
      if (selectedPlanet) {
        moveCameraToPlanet(selectedPlanet);
        updateLabel(ViewPlanet);
      }
    }
  }, [ViewPlanet]);

  const initializeScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    camera.position.set(CAMERA_INITIAL_POSITION.x, CAMERA_INITIAL_POSITION.y, CAMERA_INITIAL_POSITION.z);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  };

  const cleanupScene = () => {
    if (rendererRef.current) {
      document.body.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;
  };

  const handleMouseClick = (event) => {
    if (!cameraRef.current || !sceneRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      const planetName = selected.userData.planetName;
      moveCameraToPlanet(selected);
      updateLabel(planetName);
      setViewPlanet(planetName); // Update global variable
      if (onPlanetClick) {
        onPlanetClick(planetName); // Call onPlanetClick with the selected planet name
      }
    } else {
      if (labelRef.current) {
        labelRef.current.style.display = 'none';
      }
    }
  };

  const moveCameraToPlanet = (planet) => {
    setShowSemicircle(false);
    let progress = 0;
    const startPosition = cameraRef.current.position.clone();

    const animateCamera = () => {
      progress += 0.02;
      if (progress < 1) {
        cameraRef.current.position.lerpVectors(startPosition, planet.position, progress);
        controlsRef.current.update();
        requestAnimationFrame(animateCamera);
      } else {
        setShowSemicircle(true);
      }
    };

    animateCamera();
    controlsRef.current.target.copy(planet.position);
    controlsRef.current.update();
  };

  const updateLabel = (planetName) => {
    let labelDiv = labelRef.current;

    if (!labelDiv) {
      labelDiv = document.createElement('div');
      labelDiv.className = 'label';
      labelDiv.style.position = 'absolute';
      labelDiv.style.backgroundColor = 'black';
      labelDiv.style.padding = '5px';
      labelDiv.style.borderRadius = '5px';
      labelDiv.style.opacity = '0.7';
      labelDiv.style.pointerEvents = 'none';
      labelDiv.style.display = 'none';
      document.body.appendChild(labelDiv);
      labelRef.current = labelDiv;
    }

    labelDiv.textContent = planetName;
    labelDiv.style.display = 'block';
    labelDiv.style.left = '50%';
    labelDiv.style.bottom = '20px';
    labelDiv.style.transform = 'translateX(-50%)';
  };

  const plotExoplanets = () => {
    const planetMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Invisible material

    exoplanetData.forEach(({ planet_name, x, y, z }) => {
      if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
        const exoplanetGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const exoplanet = new THREE.Mesh(exoplanetGeometry, planetMaterial);
        exoplanet.position.set(x * PLANET_SCALE_FACTOR, y * PLANET_SCALE_FACTOR, z * PLANET_SCALE_FACTOR);
        exoplanet.userData.planetName = planet_name;
        sceneRef.current.add(exoplanet);
        exoplanetsRef.current.push(exoplanet);
      } else {
        console.warn('Invalid exoplanet position data:', { x, y, z });
      }
    });
  };

  const plotStars = () => {
    return Promise.all(starData.map((star) => {
      return new Promise((resolve, reject) => {
        if (typeof star.x === 'number' && typeof star.y === 'number' && typeof star.z === 'number') {
          const geometry = new THREE.SphereGeometry(0.05, 24, 24); // Default star size, will be updated later
          const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Default white color
          const starMesh = new THREE.Mesh(geometry, material);
          starMesh.position.set(star.x * STAR_SCALE_FACTOR, star.y * STAR_SCALE_FACTOR, star.z * STAR_SCALE_FACTOR);
          starMesh.userData.starName = star.star_name;
          sceneRef.current.add(starMesh);
          starsRef.current.push(starMesh);
          resolve(starMesh);
        } else {
          console.warn('Invalid star position data:', star);
          reject(new Error('Invalid star position data'));
        }
      });
    }));
  };

  const fetchAllStarsInfo = () => {
    return fetch('https://exoskyapi.vercel.app/get_all_stars')
      .then((response) => response.json())
      .then((data) => {
        data.forEach((starInfo) => {
          const star = starsRef.current.find(s => s.userData.starName === starInfo.star_name);
          if (star) {
            star.userData.info = starInfo;
          }
        });
        return starsRef.current;
      })
      .catch((error) => {
        console.error('Error fetching all stars info:', error);
        return [];
      });
  };

  const applyThemeToStars = (stars) => {
    stars.forEach((star) => {
      if (star && star.userData.info) {
        const { spectral_type, color_index, magnitude } = star.userData.info;
  
        // Adjust size based on magnitude (smaller magnitude = larger star)
        const scaleFactor = 1 / (magnitude + 1);
        star.scale.set(scaleFactor, scaleFactor, scaleFactor);
  
        // Function to map spectral type (OBAFGKM) to a base color
        const getColorFromSpectralType = (spectralType) => {
          if (spectralType <= 30000) return 0x9bb0ff; // O-type (blue)
          if (spectralType <= 10000) return 0xaabfff; // B-type (blue-white)
          if (spectralType <= 7500) return 0xcad7ff;  // A-type (white)
          if (spectralType <= 6000) return 0xf8f7ff;  // F-type (yellow-white)
          if (spectralType <= 5200) return 0xfff4e8;  // G-type (yellow)
          if (spectralType <= 3700) return 0xffddb4;  // K-type (orange)
          return 0xffcc6f; // M-type (red)
        };
  
        // Function to adjust the color based on color index (blue/red shift)
        const adjustColorByIndex = (baseColor, colorIndex) => {
          const color = new THREE.Color(baseColor);
          color.offsetHSL(colorIndex / 10, 0, 0); // Adjust hue based on color index
          return color;
        };
  
        // Get base color from spectral type
        const baseColor = getColorFromSpectralType(spectral_type);
        // Apply color index adjustment
        const color = adjustColorByIndex(baseColor, color_index);
        star.material.color = color;
  
        // Adjust opacity based on magnitude (brighter stars are more opaque)
        star.material.opacity = Math.min(1, 2 / (magnitude + 1));
        star.material.transparent = true;
        star.material.needsUpdate = true;
      }
    });
  };

  return (
    <>
      {cameraRef.current && rendererRef.current && (
        <CameraControls camera={cameraRef.current} renderer={rendererRef.current} controlsRef={controlsRef} />
      )}
      {showSemicircle && <Semicircle />}
    </>
  );
};

// PropTypes validation
ExoplanetPlot.propTypes = {
  exoplanetData: PropTypes.arrayOf(
    PropTypes.shape({
      planet_name: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    })
  ).isRequired,
  starData: PropTypes.arrayOf(
    PropTypes.shape({
      star_name: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    })
  ).isRequired,
  onPlanetClick: PropTypes.func,
};

export default ExoplanetPlot;