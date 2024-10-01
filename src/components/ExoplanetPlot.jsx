import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls.jsx';
import Semicircle from './semicircle/Semicircle.jsx';
import planetTexture from '../textures/00_earthmap1k.jpg';
import PropTypes from 'prop-types';

const CAMERA_INITIAL_POSITION = { x: 0, y: 0, z: 5 };
const PLANET_SCALE_FACTOR = 1;
const STAR_SCALE_FACTOR = 1000;

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
    plotStars().then(fetchStarInfo).then(applyThemeToStars);
  }, [exoplanetData, starData]);

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
      exoplanetsRef.current.forEach((planet) => planet.rotation.y += 0.01);
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

  const plotExoplanets = () => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(planetTexture, (loadedTexture) => {
      const planetMaterial = new THREE.MeshBasicMaterial({ map: loadedTexture });

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

  const fetchStarInfo = (stars) => {
    return Promise.all(stars.map((star) => {
      return fetch(`http://localhost:5000/get_stars_info?name=${star.userData.starName}`)
        .then((response) => response.json())
        .then((data) => {
          star.userData.info = data;
          console.log(`Info for ${star.userData.starName}:`, data);
          return star;
        })
        .catch((error) => {
          console.error('Error fetching star info:', error);
          return null;
        });
    }));
  };

  const applyThemeToStars = (stars) => {
    stars.forEach((star) => {
      if (star && star.userData.info) {
        const { color_index, magnitude } = star.userData.info;

        // Adjust size based on magnitude (smaller magnitude = larger star)
        const scaleFactor = 1 / (magnitude + 1);
        star.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Adjust color based on color index (using HSL for smooth color transitions)
        const color = new THREE.Color(`hsl(${(1 - color_index) * 240}, 100%, 50%)`);
        star.material.color = color;

        // Adjust brightness/intensity based on magnitude (brighter stars are more opaque)
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
      {showSemicircle && <Semicircle texture={selectedPlanetTexture} />}
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
};

export default ExoplanetPlot;
