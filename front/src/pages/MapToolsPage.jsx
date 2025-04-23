// pages/MapToolsPage.jsx
import { useState } from "react";
import MapProvider from "../components/map/MapProvider";
import MainMap from "../components/map/MainMap";
import FeatureManager from "../components/map/FeatureManager";
import styles from "../styles/theme.module.css";

export default function MapToolsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // ✅ New state for sidebar expansion

  return (
    <MapProvider>
      <div className={styles.mapWrapper}>
        <div className={styles.mapContainer}>
          <MainMap />
        </div>
        <div
          className={`${styles.mapSidebar} ${sidebarExpanded ? styles.expanded : ""}`} // ✅ Apply expanded style
          onMouseEnter={() => setSidebarExpanded(true)}   // ✅ Expand on hover
          onMouseLeave={() => setSidebarExpanded(false)}  // ✅ Collapse on mouse leave
        >
          <FeatureManager sidebarExpanded={sidebarExpanded} /> {/* Pass expansion state */}
        </div>
      </div>
    </MapProvider>
  );
}


