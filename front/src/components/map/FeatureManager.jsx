// components/map/FeatureManager.jsx
import { useState } from "react";
import SearchByNeighborhood from "../features/SearchByNeighborhood";
import SearchByRadius from "../features/SearchByRadius";
import styles from "../../styles/theme.module.css";
import AddItemFeature from "../features/AddItemFeature";

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
          className={mode === "add" ? styles.activeButton : ""}
          onClick={() => setMode("add")}
        >
          ➕ Add Item
        </button>
      </div>

      {/* Feature logic */}
      {mode === "neighborhood" && <SearchByNeighborhood />}
      {mode === "radius" && <SearchByRadius />}
      {mode === "add" && <AddItemFeature />}
    </>
  );
}



