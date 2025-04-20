// pages/MapToolsPage.jsx
import MapProvider from "../components/map/MapProvider";
import MainMap from "../components/map/MainMap";
import FeatureManager from "../components/map/FeatureManager";

export default function MapToolsPage() {
  return (
    <MapProvider>
      <MainMap>
        <FeatureManager /> {/* will now be rendered *inside* the MapContainer */}
      </MainMap>
    </MapProvider>
  );
}

