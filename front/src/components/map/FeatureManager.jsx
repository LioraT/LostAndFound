// components/map/FeatureManager.jsx
import { useContext, useState } from "react";
import FilterPanel from "../shared/FilterPanel";
import styles from "../../styles/theme.module.css";
import { MapContext } from "./MapProvider";
import api from "../../api/axios";

export default function FeatureManager() {
  const { mode, setMode, filterOptions, setFilterOptions, setDefaultCoordinates } = useContext(MapContext);
  const [filterOpen, setFilterOpen] = useState(false);  // Modal toggle for filter

  const handleModeChange = async (newMode) => {
    setMode(newMode);
    
    if (newMode === "neighborhood") {
      const defaultCoords = { lng: 34.7689, lat: 32.0631 };
      try {
        const response = await api.post('/neighborhoods/find-by-coordinates', defaultCoords);
        if (response.data.shemshchun) {
          setDefaultCoordinates(defaultCoords);
        }
      } catch (err) {
        console.error("Error fetching default neighborhood:", err);
      }
    }
  };

  return (
    <>
      {/* Mode buttons */}
      <div className={styles.featureSidebar}>
        <button
          className={`${styles.modeButton} ${mode === "neighborhood" ? styles.activeButton : ""}`}
          onClick={() => handleModeChange("neighborhood")}
          title="Neighborhood"
        >
          🔎
        </button>
        <button
          className={`${styles.modeButton} ${mode === "radius" ? styles.activeButton : ""}`}
          onClick={() => setMode("radius")}
          title="Radius"
        >
          📍
        </button>
        <button
          className={`${styles.modeButton} ${mode === "heatmap" ? styles.activeButton : ""}`}
          onClick={() => setMode("heatmap")}
          title="Heatmap"
        >
          🌡️
        </button>
        <button
          className={`${styles.modeButton} ${mode === "add" ? styles.activeButton : ""}`}
          onClick={() => setMode("add")}
          title="Add Item"
        >
          ➕
        </button>
        <button
          className={`${styles.modeButton} ${mode === "police" ? styles.activeButton : ""}`}
          onClick={() => setMode("police")}
          title="Police"
        >
          👮
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setFilterOpen(true)}
          title="Filter"
        >
          ⚙️
        </button>
      </div>

      {/* Filter Popup - positioned near sidebar */}
      {filterOpen && (
        <div className={styles.filterPopup}>
          <FilterPanel
            filter={filterOptions}
            onChange={setFilterOptions}
            showRadius={mode === "radius" || mode === "add"}
          />
          <button className={styles.modalClose} onClick={() => setFilterOpen(false)}>❌ Close</button>
        </div>
      )}
    </>
  );
}
