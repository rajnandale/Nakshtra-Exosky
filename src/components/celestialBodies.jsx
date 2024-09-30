import sunTexture from '../textures/solar_system/2k_sun.jpg';
import earthTexture from '../textures/solar_system/8k_earth_daymap.jpg';
import jupiterTexture from '../textures/solar_system/2k_jupiter.jpg';
import mercuryTexture from '../textures/solar_system/2k_mercury.jpg';
import venusTexture from '../textures/solar_system/2k_venus_surface.jpg'; // Corrected texture import
import marsTexture from '../textures/solar_system/2k_mars.jpg';
import saturnTexture from '../textures/solar_system/2k_saturn.jpg'; // Corrected typo (staurn -> saturn)
import uranusTexture from '../textures/solar_system/2k_uranus.jpg';
import neptuneTexture from '../textures/solar_system/2k_neptune.jpg';

// Solar system data with textures and diameters in Astronomical Units (AU)
const solarSystemData = [
    {
      id: '1',
      name: 'Sun',
      object_type: 'star',
      coordinates: { x: 0, y: 0, z: 0 },
      diameter: 1.39, // Diameter in AU for the sun (relative size)
      texture: sunTexture,
    },
    {
      id: '2',
      name: 'Mercury',
      object_type: 'planet',
      coordinates: { x: 0.39, y: 0, z: 0 }, // AU distance from the sun
      diameter: 0.38, // Relative size in AU
      texture: mercuryTexture,
    },
    {
      id: '3',
      name: 'Venus',
      object_type: 'planet',
      coordinates: { x: 0.72, y: 0, z: 0 }, // AU distance from the sun
      diameter: 0.95, // Relative size in AU
      texture: venusTexture,
    },
    {
      id: '4',
      name: 'Earth',
      object_type: 'planet',
      coordinates: { x: 1.00, y: 0, z: 0 }, // AU distance from the sun
      diameter: 1, // Relative size in AU
      texture: earthTexture,
    },
    {
      id: '5',
      name: 'Mars',
      object_type: 'planet',
      coordinates: { x: 1.52, y: 0, z: 0 }, // AU distance from the sun
      diameter: 0.53, // Relative size in AU
      texture: marsTexture,
    },
    {
      id: '6',
      name: 'Jupiter',
      object_type: 'planet',
      coordinates: { x: 5.20, y: 0, z: 0 }, // AU distance from the sun
      diameter: 11.21, // Relative size in AU
      texture: jupiterTexture,
    },
    {
      id: '7',
      name: 'Saturn',
      object_type: 'planet',
      coordinates: { x: 9.58, y: 0, z: 0 }, // AU distance from the sun
      diameter: 9.45, // Relative size in AU
      texture: saturnTexture, 
    },
    {
      id: '8',
      name: 'Uranus',
      object_type: 'planet',
      coordinates: { x: 19.22, y: 0, z: 0 }, // AU distance from the sun
      diameter: 4.01, // Relative size in AU
      texture: uranusTexture,
    },
    {
      id: '9',
      name: 'Neptune',
      object_type: 'planet',
      coordinates: { x: 30.05, y: 0, z: 0 }, // AU distance from the sun
      diameter: 3.88, // Relative size in AU
      texture: neptuneTexture,
    },
];

export default solarSystemData;
