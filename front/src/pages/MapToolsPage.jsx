// pages/MapToolsPage.jsx
import { useState } from "react";
import MapProvider from "../components/map/MapProvider";
import MainMap from "../components/map/MainMap";
import FeatureManager from "../components/map/FeatureManager";
import styles from "../styles/theme.module.css";

export default function MapToolsPage() {
  const [filterOpen, setFilterOpen] = useState(false);  // Only keep filter toggle

  return (
    <MapProvider>
      <div className={styles.mapWrapper}>
        <div className={styles.mapContainer}>
          <MainMap />
        </div>
        <div className={styles.mapSidebar}>  {/* No sidebarExpanded logic */}
          <FeatureManager setFilterOpen={setFilterOpen} filterOpen={filterOpen} />  {/* Pass filter state */}
        </div>
      </div>
    </MapProvider>
  );
}
