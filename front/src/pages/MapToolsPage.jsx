// pages/MapToolsPage.jsx
import { useState } from "react";
import MapProvider from "../components/map/MapProvider";
import MainMap from "../components/map/MainMap";
import FeatureManager from "../components/map/FeatureManager";
import styles from "../styles/theme.module.css";

export default function MapToolsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // ✅ New state for sidebar expansion
  const [filterOpen, setFilterOpen] = useState(false);             // ✅ Filter panel toggle

  return (
    <MapProvider>
      <div className={styles.mapWrapper}>
        <div className={styles.mapContainer}>
          <MainMap />
        </div>
        <div
          className={`${styles.mapSidebar} ${sidebarExpanded || filterOpen ? styles.expanded : ""}`}  // ✅ Expand if filter is open
          onMouseEnter={() => setSidebarExpanded(true)}   // ✅ Expand on hover
          onMouseLeave={() => setSidebarExpanded(false)}  // ✅ Collapse on mouse leave
        >
        <FeatureManager sidebarExpanded={sidebarExpanded || filterOpen} filterOpen={filterOpen} setFilterOpen={setFilterOpen} /> {/* Pass filter state */}
       </div>
      </div>
    </MapProvider>
  );
}


