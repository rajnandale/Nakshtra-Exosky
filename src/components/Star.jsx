import { useEffect } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import starImage from '../textures/stars/circle.png';

const Star = ({ starData, scene, starsRef, starScaleFactor }) => {
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load(starImage);

    const geometry = new THREE.SphereGeometry(0.05, 24, 24);
    const material = new THREE.MeshBasicMaterial({ map: starTexture, transparent: true });
    const starMesh = new THREE.Mesh(geometry, material);

    starMesh.position.set(starData.x * starScaleFactor, starData.y * starScaleFactor, starData.z * starScaleFactor);
    
    starsRef.current.push(starMesh);
    scene.add(starMesh);

    return () => {
      scene.remove(starMesh);
      starMesh.geometry.dispose();
      starMesh.material.dispose(); // Dispose material
    };
  }, [starData, scene, starsRef, starScaleFactor]);

  return null; // No additional rendering
};

Star.propTypes = {
  starData: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  scene: PropTypes.object.isRequired,
  starsRef: PropTypes.object.isRequired,
  starScaleFactor: PropTypes.number.isRequired,
};

export default Star;
