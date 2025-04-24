import { useEffect, useState } from "react";
import { useMap } from "../map/MapProvider";
import { useMapEvents, Circle } from "react-leaflet";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import { mapIcons } from "../../utils/mapIcons";
import ItemClusterGroup from './ItemClusterGroup';

export default function SearchByRadius({ filter }) {
  //const { mapRef } = useMap();

  const [items, setItems] = useState([]);
  const [center, setCenter] = useState([32.0853, 34.7818]); // Tel Aviv default
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(true); // Changed to true by default

  // Fetch items on map click
  useEffect(() => {
    const fetchNearbyItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/items/nearby", {
          params: {
            lng: center[1],
            lat: center[0],
            radius: filter.radius || 1500,
            item_category: filter.item_category || undefined,
            item_type: filter.item_type || undefined,
            resolved: filter.resolved || undefined,
            keywords: filter.keywords || undefined,
            self: filter.self || undefined 
          }
        });
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyItems();
  }, [center, filter]);

  // Hook into map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setCenter([e.latlng.lat, e.latlng.lng]);
        setClicked(true);
      }
    });
    return null;
  };

  return (
    <>
      <MapClickHandler />

      {!clicked && (
        <div className={styles.mapHint}>
          🖱️ Click on the map to search lost/found items within {filter.radius || 1500} meters
        </div>
      )}

      {loading && (
        <div className={styles.loadingBox}>Loading nearby items...</div>
      )}

      {clicked && (
        <Circle
          center={center}
          radius={filter.radius || 1500} // ✅ dynamic radius from filter
          pathOptions={{ color: "blue", fillOpacity: 0.1 }}
        />
      )}

      {/* Render the clusters for lost and found items */}
      <ItemClusterGroup items={items} />

      {/* Add custom clustering logic if needed */}
      </>
  );
}
