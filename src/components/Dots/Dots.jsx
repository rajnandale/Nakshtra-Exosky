// Dots.jsx
import './Dots.css';

const Dots = () => {
  const getRandomPosition = () => Math.random();
  
  return (
    <div className="dots-container">
      {Array.from({ length: 100 }).map((_, index) => (
        <div 
          key={index} 
          className="dot" 
          style={{
            top: `${getRandomPosition() * 100}vh`, // Random vertical position
            left: `${getRandomPosition() * 100}vw`, // Random horizontal position
          }} 
        />
      ))}
    </div>
  );
};

export default Dots;
