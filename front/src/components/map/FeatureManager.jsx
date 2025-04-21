// components/map/FeatureManager.jsx
import { useState } from "react";
import SearchByNeighborhood from "../features/SearchByNeighborhood";
import SearchByRadius from "../features/SearchByRadius";
import HeatmapView from "../features/HeatmapView";
import ItemZoom from "../features/ItemZoom";
import AddItemFeature from "../features/AddItemFeature";
import PoliceStations from "../features/SearchByPoliceStations";
import FilterPanel from "../shared/FilterPanel"; // ✅ NEW
import styles from "../../styles/theme.module.css";

export default function FeatureManager() {
  const [mode, setMode] = useState("neighborhood");

  // ✅ Shared filter state
  const [filterOptions, setFilterOptions] = useState({
    item_category: "",
    item_type: "",
    resolved: "",
    keywords: "",
    radius: 1500
  });

  return (
    <>
      {/* ✅ Shared filter panel */}
      <FilterPanel
        filter={filterOptions}
        onChange={setFilterOptions}
        showRadius={mode === "radius" || mode === "add"}
      />

      {/* Floating sidebar */}
      <div className={styles.featureSidebar}>
        <button
          className={mode === "neighborhood" ? styles.activeButton : ""}
          onClick={() => setMode("neighborhood")}
        >
          🔎 Neighborhood
        </button>
        <button
          className={mode === "radius" ? styles.activeButton : ""}
          onClick={() => setMode("radius")}
        >
          📍 Radius
        </button>
        <button
          className={mode === "heatmap" ? styles.activeButton : ""}
          onClick={() => setMode("heatmap")}
        >
          🌡️ Heatmap
        </button>
        <button
          className={mode === "add" ? styles.activeButton : ""}
          onClick={() => setMode("add")}
        >
          ➕ Add Item
        </button>
        <button
          className={mode === "police" ? styles.activeButton : ""}
          onClick={() => setMode("police")}
        >
          👮 Police Stations
        </button>
      </div>

      {/* Feature logic */}
      <ItemZoom />

      {mode === "neighborhood" && <SearchByNeighborhood filter={filterOptions} />}
      {mode === "radius" && <SearchByRadius filter={filterOptions} />}
      {mode === "heatmap" && <HeatmapView />}
      {mode === "add" && <AddItemFeature filter={filterOptions} />}
      {mode === "police" && <PoliceStations />}
    </>
  );
}
