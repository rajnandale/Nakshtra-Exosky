import React, { createContext, useState, useContext } from 'react';

const SelectedStarsContext = createContext();

export const SelectedStarsProvider = ({ children }) => {
  const [selectedStars, setSelectedStars] = useState([]);

  return (
    <SelectedStarsContext.Provider value={{ selectedStars, setSelectedStars }}>
      {children}
    </SelectedStarsContext.Provider>
  );
};

export const useSelectedStars = () => useContext(SelectedStarsContext);