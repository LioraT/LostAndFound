// components/map/MapProvider.jsx
import { createContext, useContext, useRef, useState } from "react";

export const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export default function MapProvider({ children }) {
  const mapRef = useRef(null);
  
  // Initialize with no mode selected
  const [mode, setMode] = useState("");
  const [defaultCoordinates, setDefaultCoordinates] = useState(null);
  const [currentNeighborhood, setCurrentNeighborhood] = useState(null);
  const [neighborhoodPolygon, setNeighborhoodPolygon] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    item_category: "",
    item_type: "",
    resolved: "",
    keywords: "",
    radius: 1500,
    self: false, // <-- Added "self" here
  });

  return (
    <MapContext.Provider value={{ 
      mapRef, 
      mode, setMode, 
      filterOptions, setFilterOptions,
      defaultCoordinates,
      setDefaultCoordinates,
      currentNeighborhood, setCurrentNeighborhood,
      neighborhoodPolygon, setNeighborhoodPolygon
    }}>
      {children}
    </MapContext.Provider>
  );
}
