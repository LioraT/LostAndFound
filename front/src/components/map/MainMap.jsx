// components/map/MainMap.jsx
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useMap } from "./MapProvider";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

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
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={true}
      >
        {children}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
