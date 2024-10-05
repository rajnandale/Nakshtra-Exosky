import { createContext, useContext, useState } from 'react';

const ConstellationPointsContext = createContext();

export const useConstellationPoints = () => useContext(ConstellationPointsContext);

export const ConstellationPointsProvider = ({ children }) => {
  const [constellationPoints, setConstellationPoints] = useState([]);

  return (
    <ConstellationPointsContext.Provider value={{ constellationPoints, setConstellationPoints }}>
      {children}
    </ConstellationPointsContext.Provider>
  );
};