import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls.jsx';
import Semicircle from './semicircle/Semicircle.jsx';
import PropTypes from 'prop-types';
import { ViewPlanet, setViewPlanet } from '../global'; // Import global variable and setter

const CAMERA_INITIAL_POSITION = { x: 0, y: 0, z: 5 };
const PLANET_SCALE_FACTOR = 1;
const STAR_SCALE_FACTOR = 1000;

const ExoplanetPlot = ({ exoplanetData, starData, onPlanetClick, setPlotReady, selectedStars, setSelectedStars, drawMode }) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const exoplanetsRef = useRef([]);
  const starsRef = useRef([]);
  const labelRef = useRef(null);
  const [showSemicircle, setShowSemicircle] = useState(true);
  const [constellationPoints, setConstellationPoints] = useState([]);

  useEffect(() => {
    if (exoplanetData.length === 0 && starData.length === 0) return;

    initializeScene();
    return cleanupScene;
  }, [exoplanetData, starData]);

  useEffect(() => {
    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, [drawMode]);  // Ensure drawMode is updated on mouse click

  useEffect(() => {
    if (!sceneRef.current) return;
    plotExoplanets();
    plotStars();
    setPlotReady(true); // Set plot ready after rendering is complete
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

  const drawConstellation = () => {
    if (constellationPoints.length < 2) return; // At least 2 points are required to draw a line
    
    // Create a line geometry from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(constellationPoints);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.Line(geometry, material);

    // Add the line to the scene
    sceneRef.current.add(line);

    // Save the drawn line for possible future updates/removals
    setConstellationLines((prevLines) => [...prevLines, line]);
  };

  const handleMouseClick = (event) => {
    if (!cameraRef.current || !sceneRef.current || !drawMode) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children);

    if (intersects.length > 0) {
      const selected = intersects[0].object;

      if (selected.userData.starName) {
        const starName = selected.userData.starName;

        if (!selectedStars.includes(starName)) {
          // Add the star to the selectedStars and store its position
          setSelectedStars((prevSelectedStars) => [...prevSelectedStars, starName]);
          setConstellationPoints((prevPoints) => [...prevPoints, selected.position.clone()]);

          // Highlight the selected star
          selected.material.emissive.set(0xff0000);

          // Draw the constellation dynamically whenever points are updated
          drawConstellation();
        }
      }
    } else {
      // Hide the label if no object is clicked
      if (labelRef.current) {
        labelRef.current.style.display = 'none';
      }
    }
  };

  const moveCameraToPlanet = (planet) => {
    setShowSemicircle(false);
    setSelectedStars([]);
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
        setPlotReady(true); // Set plotReady to true after animation
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
    starData.forEach(({ star_name, x, y, z }) => {
      if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
        const geometry = new THREE.SphereGeometry(0.05, 24, 24); // Default star size
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Default white color
        const starMesh = new THREE.Mesh(geometry, material);
        starMesh.position.set(x * STAR_SCALE_FACTOR, y * STAR_SCALE_FACTOR, z * STAR_SCALE_FACTOR);
        starMesh.userData.starName = star_name;
        sceneRef.current.add(starMesh);
        starsRef.current.push(starMesh);
      } else {
        console.warn('Invalid star position data:', { x, y, z });
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
      star_name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    })
  ).isRequired,
  onPlanetClick: PropTypes.func,
  setPlotReady: PropTypes.func.isRequired,
  selectedStars: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  setSelectedStars: PropTypes.func.isRequired,
  drawMode: PropTypes.bool.isRequired, // Added new prop
};

export default ExoplanetPlot;
