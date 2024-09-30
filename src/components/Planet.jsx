import { useEffect } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const Planet = ({ id, name, object_type, coordinates: { x, y, z }, diameter, texture, scene }) => {
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Log the name and object_type to avoid the unused variable warning
    console.log(`Planet Name: ${name}, Type: ${object_type}`);
    
    // Load texture and create planet mesh
    textureLoader.load(texture, (loadedTexture) => {
      const material = new THREE.MeshBasicMaterial({ map: loadedTexture });
      const geometry = new THREE.SphereGeometry(diameter / 2, 24, 24); // Use radius
      const planetMesh = new THREE.Mesh(geometry, material);

      planetMesh.position.set(x, y, z);
      planetMesh.name = id;

      scene.add(planetMesh);

      // Clean up resources when component unmounts
      return () => {
        scene.remove(planetMesh);
        planetMesh.geometry.dispose();
        if (planetMesh.material.map) planetMesh.material.map.dispose(); // Dispose texture
        planetMesh.material.dispose();
      };
    });
  }, [x, y, z, id, name, object_type, diameter, texture, scene]);

  return null; // No rendering outside of Three.js
};

Planet.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  object_type: PropTypes.string.isRequired,
  coordinates: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  diameter: PropTypes.number.isRequired,
  texture: PropTypes.string.isRequired,
  scene: PropTypes.object.isRequired,
};

export default Planet;
