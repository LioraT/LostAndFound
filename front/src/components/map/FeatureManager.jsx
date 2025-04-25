// components/map/FeatureManager.jsx

import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";  // ✅ Add this
import FilterPanel from "../shared/FilterPanel";
import styles from "../../styles/theme.module.css";
import { MapContext } from "./MapProvider";
import api from "../../api/axios";

export default function FeatureManager() {
  const { 
    mode, 
    setMode, 
    filterOptions, 
    setFilterOptions, 
    setDefaultCoordinates,
    setCurrentNeighborhood,
    setNeighborhoodPolygon
  } = useContext(MapContext);
  const [filterOpen, setFilterOpen] = useState(false);  // Modal toggle for filter

  const [searchParams, setSearchParams] = useSearchParams();  // ✅ Add this
  const itemId = searchParams.get('item');   // ✅ Extract itemId

  const handleModeChange = (newMode) => {
    // Clear itemId first
    if (searchParams.has('item')) {
      searchParams.delete('item');
      setSearchParams(searchParams);

      // Delay setting mode until after URL update
      setTimeout(() => setMode(newMode), 0);
    } else {
      setMode(newMode);
    }

    // Clear neighborhood-related state if exiting neighborhood
    if (mode === "neighborhood" && newMode !== "neighborhood") {
      setCurrentNeighborhood(null);
      setNeighborhoodPolygon(null);
      setDefaultCoordinates(null);
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
          onClick={() => handleModeChange("radius")}
          title="Radius"
        >
          📍
        </button>
        <button
          className={`${styles.modeButton} ${mode === "heatmap" ? styles.activeButton : ""}`}
          onClick={() => handleModeChange("heatmap")}
          title="Heatmap"
        >
          🌡️
        </button>
        <button
          className={`${styles.modeButton} ${mode === "add" ? styles.activeButton : ""}`}
          onClick={() => handleModeChange("add")}
          title="Add Item"
        >
          ➕
        </button>
        <button
          className={`${styles.modeButton} ${mode === "police" ? styles.activeButton : ""}`}
          onClick={() => handleModeChange("police")}
          title="Police"
        >
          👮
        </button>

        <button
          className={`${styles.modeButton} ${mode === "focus" ? styles.activeButton : ""}`}
          title="Item Focus"
          disabled  // Makes it non-clickable
        >
          🎯
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setFilterOpen(true)}
          title="Filter"
        >
          ⚙️
        </button>
      </div>

      {/* Filter Popup */}
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
