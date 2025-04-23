// components/map/FeatureManager.jsx
import { useContext } from "react";
import FilterPanel from "../shared/FilterPanel";
import styles from "../../styles/theme.module.css";
import { MapContext } from "./MapProvider";

export default function FeatureManager({ sidebarExpanded, filterOpen, setFilterOpen }) {  // ✅ Get filterOpen & setFilterOpen from parent
  const { mode, setMode, filterOptions, setFilterOptions } = useContext(MapContext);

  return (
    <>
      {/* Mode buttons */}
      <div className={styles.featureSidebar}>
        <button onClick={() => setMode("neighborhood")} className={mode === "neighborhood" ? styles.activeButton : ""}>
          📍 <span className={styles.buttonLabel}>Neighborhood</span>
        </button>
        <button onClick={() => setMode("radius")} className={mode === "radius" ? styles.activeButton : ""}>
          🔎 <span className={styles.buttonLabel}>Radius</span>
        </button>
        <button onClick={() => setMode("heatmap")} className={mode === "heatmap" ? styles.activeButton : ""}>
          🌡️ <span className={styles.buttonLabel}>Heatmap</span>
        </button>
        <button onClick={() => setMode("add")} className={mode === "add" ? styles.activeButton : ""}>
          ➕ <span className={styles.buttonLabel}>Add Item</span>
        </button>
        <button onClick={() => setMode("police")} className={mode === "police" ? styles.activeButton : ""}>
          👮 <span className={styles.buttonLabel}>Police</span>
        </button>
      </div>

      {/* Filter Toggle (Always visible) */}
      <div className={styles.filterToggle} onClick={() => setFilterOpen(!filterOpen)}>
        ⚙️
      </div>

      {/* Filter Panel */}
      {sidebarExpanded && filterOpen && (
        <div className={styles.filterPanelExpanded}>
          <FilterPanel
            filter={filterOptions}
            onChange={setFilterOptions}
            showRadius={mode === "radius" || mode === "add"}
          />
        </div>
      )}
    </>
  );
}
