// components/map/MainMap.jsx
import { MapContainer, TileLayer } from "react-leaflet";
import { useMap } from "./MapProvider";
import "leaflet/dist/leaflet.css";

export default function MainMap({ children }) {
  const { mapRef } = useMap();

  return (
    <MapContainer
      center={[32.08, 34.78]}
      zoom={13}
      scrollWheelZoom={true}
      whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children} {/* ← allows features to inject into the map */}
    </MapContainer>
  );
}
