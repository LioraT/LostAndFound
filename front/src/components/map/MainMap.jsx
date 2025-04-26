// components/map/MainMap.jsx

import { MapContainer, TileLayer } from "react-leaflet";
import { useMap } from "./MapProvider";
import { useContext, useEffect } from "react";
import { MapContext } from "./MapProvider";
import SearchByNeighborhood from "../features/SearchByNeighborhood";
import SearchByRadius from "../features/SearchByRadius";
import SearchByItem from "../features/SearchByItem"; // ✅ Added import
import AddItemFeature from "../features/AddItemFeature";
import HeatmapView from "../features/HeatmapView";
import PoliceStations from "../features/SearchByPoliceStations";
import AllItemsView from "../features/AllItemsView";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "react-router-dom";

export default function MainMap() {
  const { mapRef } = useMap();
  const { mode, setMode, filterOptions } = useContext(MapContext); // ✅ Pull mode + filter
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');
  const radius = filterOptions?.radius || 1500; // ✅ Default radius fallback

  // ✅ Set mode to "focus" if itemId exists
  useEffect(() => {
    if (itemId && mode !== "focus") {
      setMode("focus");
    }
  }, [itemId, mode, setMode]);

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

      {mode === "focus" && itemId ? (
        <SearchByItem
          itemId={itemId}
          radius={radius}
          matchingResolved={filterOptions?.matchingResolved || ''}  // 🔥 Pass matchingResolved
        />
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