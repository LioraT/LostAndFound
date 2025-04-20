// components/map/FeatureManager.jsx
import { useState } from "react";
import SearchByNeighborhood from "../features/SearchByNeighborhood";
import SearchByRadius from "../features/SearchByRadius";
import HeatmapView from "../features/HeatmapView";
import ItemZoom from "../features/ItemZoom";
import styles from "../../styles/theme.module.css";

export default function FeatureManager() {
  const [mode, setMode] = useState("neighborhood");

  return (
    <>
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
      </div>

      {/* Feature logic */}
      {<ItemZoom />} {/* Always render ItemZoom */}
      {mode === "neighborhood" && <SearchByNeighborhood />}
      {mode === "radius" && <SearchByRadius />}
      {mode === "heatmap" && <HeatmapView />}
    </>
  );
}
