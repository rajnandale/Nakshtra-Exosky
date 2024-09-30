import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PropTypes from 'prop-types';

const CameraControls = ({ camera, renderer, controlsRef }) => {
  useEffect(() => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    return () => {
      controls.dispose(); // Cleanup controls
    };
  }, [camera, renderer, controlsRef]);

  return null; // No additional rendering
};

CameraControls.propTypes = {
  camera: PropTypes.object.isRequired,
  renderer: PropTypes.object.isRequired,
  controlsRef: PropTypes.object.isRequired,
};

export default CameraControls;
