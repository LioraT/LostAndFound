// components/map/MapProvider.jsx
import { createContext, useContext, useRef } from "react";

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export default function MapProvider({ children }) {
  const mapRef = useRef(null);

  return (
    <MapContext.Provider value={{ mapRef }}>
      {children}
    </MapContext.Provider>
  );
}
