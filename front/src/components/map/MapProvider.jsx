// components/map/MapProvider.jsx
import { createContext, useContext, useRef, useState } from "react";

export const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export default function MapProvider({ children }) {
  const mapRef = useRef(null);
  
  // ✅ Add mode and filterOptions here:
  const [mode, setMode] = useState("neighborhood");
  const [filterOptions, setFilterOptions] = useState({
    item_category: "",
    item_type: "",
    resolved: "",
    keywords: "",
    radius: 1500
  });

  return (
    <MapContext.Provider value={{ 
      mapRef, 
      mode, setMode, 
      filterOptions, setFilterOptions  // ✅ Add to context
    }}>
      {children}
    </MapContext.Provider>
  );
}
