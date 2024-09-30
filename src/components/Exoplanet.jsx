import { useEffect } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const Exoplanet = ({ planetData, planetMaterial, scene, exoplanetsRef }) => {
  useEffect(() => {
    const { planet_name, x, y, z } = planetData;
    const exoplanetGeometry = new THREE.SphereGeometry(0.2, 32, 32); // Size of exoplanets
    const exoplanet = new THREE.Mesh(exoplanetGeometry, planetMaterial);
    exoplanet.position.set(x, y, z);
    exoplanet.userData.planetName = planet_name; // Store planet name in userData
    scene.add(exoplanet);
    exoplanetsRef.current.push(exoplanet); // Store for rotation

    return () => {
      scene.remove(exoplanet); // Cleanup on unmount
      exoplanet.geometry.dispose(); // Dispose geometry
      exoplanet.material.dispose(); // Dispose material
    };
  }, [planetData, planetMaterial, scene, exoplanetsRef]);

  return null; // No additional rendering
};

Exoplanet.propTypes = {
  planetData: PropTypes.shape({
    planet_name: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  planetMaterial: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  exoplanetsRef: PropTypes.object.isRequired,
};

export default Exoplanet;
