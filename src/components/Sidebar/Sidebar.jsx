import { useState } from 'react';
import './Sidebar.css'; // Import the CSS for styling
import Encyclopedia from '../Encyclopedia/Encyclopedia.jsx';  // Import the Encyclopedia component

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);  // New state to toggle Encyclopedia

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to open the Encyclopedia view
  const openEncyclopedia = () => {
    setShowEncyclopedia(true);
  };

  // Function to go back to the sidebar view from Encyclopedia
  const handleBackToSidebar = () => {
    setShowEncyclopedia(false);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {showEncyclopedia ? (
        // Show Encyclopedia component when button is clicked
        <Encyclopedia onBack={handleBackToSidebar} />
      ) : (
        // Show default sidebar content when Encyclopedia is not open
        <div className="sidebar-content">
          <h2>SUN</h2>
          <h3>YELLOW DWARF</h3>
          <div className="menu-items">
            <button className="menu-item">VISIT</button>
            <button className="menu-item" onClick={openEncyclopedia}>ENCYCLOPEDIA</button> {/* Open Encyclopedia */}
            <button className="menu-item">STRUCTURE</button>
          </div>
          <div className="icons">
            <div className="menu-item">SWITCH PLANET</div>
            <div className="menu-item">NIGHT SKY</div>
            <div className="menu-item">SOLAR SYSTEM</div>
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button */}
      <div className="arrow-button" onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </div>
    </div>
  );
};

export default Sidebar;
