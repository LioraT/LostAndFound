// components/map/FeatureManager.jsx
import { useContext, useState } from "react";
import FilterPanel from "../shared/FilterPanel";
import styles from "../../styles/theme.module.css";
import { MapContext } from "./MapProvider";
import api from "../../api/axios";

export default function FeatureManager({ sidebarExpanded }) {
  const { mode, setMode, filterOptions, setFilterOptions, setDefaultCoordinates } = useContext(MapContext);
  const [filterOpen, setFilterOpen] = useState(false);  // ✅ Local state for filter toggle

  const handleModeChange = async (newMode) => {
    setMode(newMode);
    
    if (newMode === "neighborhood") {
      // Default coordinates for Neve Tzedek
      const defaultCoords = { lng: 34.7689, lat: 32.0631 };
      try {
        const response = await api.post('/neighborhoods/find-by-coordinates', defaultCoords);
        if (response.data.shemshchun) {
          // Trigger the neighborhood search with default coordinates
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
          className={mode === "neighborhood" ? styles.activeButton : ""}
          onClick={() => handleModeChange("neighborhood")}
        >
          🔎
        </button>
        <button
          className={mode === "radius" ? styles.activeButton : ""}
          onClick={() => setMode("radius")}
        >
          📍
        </button>
        <button
          className={mode === "heatmap" ? styles.activeButton : ""}
          onClick={() => setMode("heatmap")}
        >
          🌡️
        </button>
        <button
          className={mode === "add" ? styles.activeButton : ""}
          onClick={() => setMode("add")}
        >
          ➕
        </button>
        <button
          className={mode === "police" ? styles.activeButton : ""}
          onClick={() => setMode("police")}
        >
          👮
        </button>
      </div>

      {/* Filter Panel Toggle */}
      {sidebarExpanded && (
        <>
          {!filterOpen && (
            <div className={styles.filterToggle} onClick={() => setFilterOpen(true)}>
              ⚙️
            </div>
          )}

          {filterOpen && (
            <div className={styles.filterPanelExpanded}>
              <FilterPanel
                filter={filterOptions}
                onChange={setFilterOptions}
                showRadius={mode === "radius" || mode === "add"}
              />
              <button onClick={() => setFilterOpen(false)}>❌ Close</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

