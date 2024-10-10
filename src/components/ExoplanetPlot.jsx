import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls.jsx';
import Semicircle from './semicircle/Semicircle.jsx';
import PropTypes from 'prop-types';
import drawIcon from '../assets/constillation.png';
import { ViewPlanet, setViewPlanet } from '../global'; // Import global variable and setter
import RightPanel from './RightPanel/RightPanel.jsx';

const CAMERA_INITIAL_POSITION = { x: 0, y: 0, z: 5 };
const PLANET_SCALE_FACTOR = 1;
const STAR_SCALE_FACTOR = 1000;

const ExoplanetPlot = ({ exoplanetData, starData, onPlanetClick, setPlotReady, selectedStars, setSelectedStars, savedStars = [], setSavedStars = () => {}, resetConstellationPointsRef , resetNewConnectRef, }) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const exoplanetsRef = useRef([]);
  const starsRef = useRef([]);
  const labelRef = useRef(null);
  const [showSemicircle, setShowSemicircle] = useState(true);
  const [constellationPoints, setConstellationPoints] = useState([]);
  const lineMeshesRef = useRef([]); // Store all constellation lines
  const [previousLines, setPreviousLines] = useState([]); // Store previously drawn lines
  const [drawMode, setDrawMode] = useState(false);
  const [drawLines, setDrawLines] = useState(false);
  const [isRightPanelVisible, setRightPanelVisible] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(ViewPlanet);

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


  useEffect(() => {
    if (exoplanetData.length === 0 && starData.length === 0) return;

    initializeScene();
    return cleanupScene;
  }, [exoplanetData, starData]);

  useEffect(() => {
    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, [drawMode]);

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

  useEffect(() => {
    if (drawLines && constellationPoints.length >= 2) {
      drawConstellation();
    }
  }, [constellationPoints, drawLines]);  // Redraw lines when constellationPoints or drawLines change

  useEffect(() => {
    // Re-render previously drawn lines when the component mounts
    previousLines.forEach(line => sceneRef.current.add(line));
  }, [previousLines]);

  useEffect(() => {
    if (!drawMode) {
      window.addEventListener('mousemove', handleMouseHover);
      return () => window.removeEventListener('mousemove', handleMouseHover);
    }
  }, [drawMode]);

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
          setSelectedStars((prevSelectedStars) => [...prevSelectedStars, starName]);
          setConstellationPoints((prevPoints) => [...prevPoints, selected.position.clone()]);

          // Highlight the selected star
          // selected.material.emissive.set(0xff0000);
          // toggleDrawMode()
          
        }
      }
    }
  };

  const handleMouseHover = (event) => {
    if (!cameraRef.current || !sceneRef.current) return;
  
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, cameraRef.current);
  
    const intersects = raycaster.intersectObjects(sceneRef.current.children);
  
    if (intersects.length > 0) {
      const hovered = intersects[0].object;
  
      if (hovered.userData.starName) {
        updateLabel(hovered.userData.starName);
      } else {
        hideLabel();
      }
    } else {
      hideLabel();
    }
  };

  const drawConstellation = () => {
    // Clear previous lines
    lineMeshesRef.current.forEach(line => sceneRef.current.remove(line));
    lineMeshesRef.current = [];

    const points = constellationPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Yellow line

    const newLineMesh = new THREE.Line(lineGeometry, lineMaterial);
    sceneRef.current.add(newLineMesh);
    lineMeshesRef.current.push(newLineMesh);  // Store the new line mesh

    // Save the new line to previousLines state
    setPreviousLines((prevLines) => [...prevLines, newLineMesh]);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
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

  const updateLabel = (name) => {
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

    labelDiv.textContent = name;
    labelDiv.style.display = 'block';
    labelDiv.style.left = '50%';
    labelDiv.style.bottom = '20px';
    labelDiv.style.transform = 'translateX(-50%)';
  };

  const hideLabel = () => {
    if (labelRef.current) {
      labelRef.current.style.display = 'none';
    }
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

  const handleResetConstellationPoints = () => {
    setConstellationPoints([]);
    setSavedStars([]);
    setSelectedStars([]);
    lineMeshesRef.current.forEach(line => sceneRef.current.remove(line)); // Remove all lines
    lineMeshesRef.current = []; // Clear the line meshes array
    previousLines.forEach(line => sceneRef.current.remove(line)); // Remove previous lines
    setPreviousLines([]); // Clear the previous lines array
  };

  const handleNewConnect = () => {
    setConstellationPoints([]);
    setSelectedStars([]);
  };

  // Assign the internal reset function to the ref
  useEffect(() => {
    if (resetConstellationPointsRef) {
      resetConstellationPointsRef.current = handleResetConstellationPoints;
    }
    if (resetNewConnectRef) {
      resetNewConnectRef.current = handleNewConnect;
    }
  }, [resetConstellationPointsRef, resetNewConnectRef]);

    // Function to take a screenshot
    const handleScreenshot = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
  
      // Hide UI elements (buttons, labels) during the screenshot
      const buttonsDiv = document.querySelector(
        'div[style*="position: absolute; top: 10px"]'
      );
      const selectedPlanetsDiv = document.querySelector(
        'div[style*="position: absolute; top: 100px"]'
      );
  
      if (buttonsDiv) buttonsDiv.style.display = "none";
      if (selectedPlanetsDiv) selectedPlanetsDiv.style.display = "none";
  
      // Render the scene again to ensure it is up-to-date
      rendererRef.current.render(sceneRef.current, cameraRef.current);
  
      // Get the Three.js canvas from the renderer
      const canvas = rendererRef.current.domElement;
  
      // Convert the Three.js canvas content to a data URL (PNG format)
      const dataURL = canvas.toDataURL("image/png");
  
      // Create a link element to download the screenshot
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "constellation_space_screenshot.png"; // File name for the screenshot
      link.click(); // Simulate a click to download the screenshot
  
      // Restore the visibility of the UI elements
      if (buttonsDiv) buttonsDiv.style.display = "block";
      if (selectedPlanetsDiv) selectedPlanetsDiv.style.display = "block";
    };

  return (
    <>
     <button className="draw-button" onClick={toggleDrawMode}>
        <img src={drawIcon} alt="Draw Mode" />
      </button>
      {cameraRef.current && rendererRef.current && (
        <CameraControls camera={cameraRef.current} renderer={rendererRef.current} controlsRef={controlsRef} />
      )}
      {showSemicircle && <Semicircle />}
      <RightPanel
        handleScreenshot={handleScreenshot}
        selectedStars={selectedStars}
        removeStar={(star) =>
          setSelectedStars(selectedStars.filter((s) => s !== star))
        }
        resetConstellations={() => setSelectedStars([])}
        isOpen={isRightPanelVisible}
        setIsOpen={setRightPanelVisible}
        setSelectedStars={setSelectedStars}
        toggleDrawLines={toggleDrawLines} // Pass toggleDrawLines to RightPanel
      />
    </>
  );
};

ExoplanetPlot.propTypes = {
  exoplanetData: PropTypes.array.isRequired,
  starData: PropTypes.array.isRequired,
  onPlanetClick: PropTypes.func.isRequired,
  setPlotReady: PropTypes.func.isRequired,
  selectedStars: PropTypes.array.isRequired,
  setSelectedStars: PropTypes.func.isRequired,
  drawMode: PropTypes.bool.isRequired,
  drawLines: PropTypes.bool.isRequired,
  savedStars: PropTypes.array, // New prop for savedStars
  setSavedStars: PropTypes.func, // New prop for setSavedStars
  resetConstellationPointsRef: PropTypes.object, // New prop for reset function ref
  resetNewConnectRef: PropTypes.object, // New prop for reset function ref
};

export default ExoplanetPlot;
//surprise