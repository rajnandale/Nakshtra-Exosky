import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls.jsx';
import Semicircle from './semicircle/Semicircle.jsx';
import planetTexture from '../textures/00_earthmap1k.jpg';
import starImage from '../textures/stars/circle.png';
import PropTypes from 'prop-types'; // Import PropTypes

const ExoplanetPlot = ({ exoplanetData, starData }) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const exoplanetsRef = useRef([]);
  const starsRef = useRef([]);
  const labelRef = useRef(null);
  const [showSemicircle, setShowSemicircle] = useState(true);
  const [selectedPlanetTexture, setSelectedPlanetTexture] = useState(new THREE.TextureLoader().load(planetTexture));

  useEffect(() => {
    if (exoplanetData.length === 0 && starData.length === 0) return;

    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    camera.position.set(0, 0, 5); // Set initial camera position

    const animate = () => {
      requestAnimationFrame(animate);
      exoplanetsRef.current.forEach((planet) => planet.rotation.y += 0.01);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup resources
      document.body.removeChild(renderer.domElement);
      // Dispose of THREE.js objects
      renderer.dispose();
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [exoplanetData, starData]);

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
        setSelectedPlanetTexture(planet.material.map);
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

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      if (!cameraRef.current || !sceneRef.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      if (intersects.length > 0) {
        const selected = intersects[0].object;
        const planetName = selected.userData.planetName;

        moveCameraToPlanet(selected);
        updateLabel(planetName);
      } else {
        if (labelRef.current) {
          labelRef.current.style.display = 'none';
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    return () => {
      window.removeEventListener('click', onMouseClick);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const textureLoader = new THREE.TextureLoader();

    // Load planet texture properly
    textureLoader.load(planetTexture, (loadedTexture) => {
      const planetMaterial = new THREE.MeshBasicMaterial({ map: loadedTexture });

      const planetScaleFactor = 1;

      // Plot Exoplanets with the loaded texture
      exoplanetData.forEach(({ planet_name, x, y, z }) => {
        const exoplanetGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const exoplanet = new THREE.Mesh(exoplanetGeometry, planetMaterial);

        // Ensure x, y, z are valid before setting position
        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
          exoplanet.position.set(x * planetScaleFactor, y * planetScaleFactor, z * planetScaleFactor);
          exoplanet.userData.planetName = planet_name;
          scene.add(exoplanet);
          exoplanetsRef.current.push(exoplanet);
        } else {
          console.warn('Invalid exoplanet position data:', { x, y, z });
        }
      });
    });

    // Plot Stars similarly
    const starTexture = textureLoader.load(starImage);
    starData.forEach((star) => {
      const geometry = new THREE.SphereGeometry(0.05, 24, 24);
      const material = new THREE.MeshBasicMaterial({ map: starTexture, transparent: true });
      const starMesh = new THREE.Mesh(geometry, material);

      const starScaleFactor = 1000;
      if (typeof star.x === 'number' && typeof star.y === 'number' && typeof star.z === 'number') {
        starMesh.position.set(star.x * starScaleFactor, star.y * starScaleFactor, star.z * starScaleFactor);
        scene.add(starMesh);
        starsRef.current.push(starMesh);
      } else {
        console.warn('Invalid star position data:', star);
      }
    });
  }, [exoplanetData, starData]);

  return (
    <>
      {cameraRef.current && rendererRef.current && (
        <CameraControls camera={cameraRef.current} renderer={rendererRef.current} controlsRef={controlsRef} />
      )}
      {showSemicircle && <Semicircle texture={selectedPlanetTexture} />}
    </>
  );
};

// PropTypes validation
ExoplanetPlot.propTypes = {
  exoplanetData: PropTypes.array.isRequired,
  starData: PropTypes.array.isRequired,
};

export default ExoplanetPlot;
