// components/map/MainMap.jsx
import { MapContainer, TileLayer } from "react-leaflet";
import { useMap } from "./MapProvider";
import { useContext } from "react";
import { MapContext } from "./MapProvider";
import SearchByNeighborhood from "../features/SearchByNeighborhood";
import SearchByRadius from "../features/SearchByRadius";
import AddItemFeature from "../features/AddItemFeature";
import HeatmapView from "../features/HeatmapView";
import PoliceStations from "../features/SearchByPoliceStations";  // ✅ Add this back
import ItemZoom from "../features/ItemZoom";
import AllItemsView from "../features/AllItemsView";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "react-router-dom";

export default function MainMap() {
  const { mapRef } = useMap();
  const { mode, filterOptions } = useContext(MapContext); // ✅ Pull mode + filter
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');
  return (
    <MapContainer
      center={[32.08, 34.78]}
      zoom={13}
      scrollWheelZoom={true}
      whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {itemId ? (
        <ItemZoom />
      ) : (
        <>
          {!mode && <AllItemsView />}
          {mode === "neighborhood" && (<SearchByNeighborhood filter={filterOptions} active={mode === "neighborhood"} />)}
          {mode === "radius" && <SearchByRadius filter={filterOptions} />}
          {mode === "add" && <AddItemFeature filter={filterOptions} />}
          {mode === "heatmap" && <HeatmapView filter={filterOptions} />}
          {mode === "police" && <PoliceStations />}
        </>
      )}
    </MapContainer>
  );
}
