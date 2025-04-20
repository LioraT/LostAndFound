// components/features/SearchByRadius.jsx
import { useEffect, useState } from "react";
import { useMap } from "../map/MapProvider";
import { useMapEvents, Marker, Circle, Popup } from "react-leaflet";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import L from "leaflet";
import { mapIcons } from "../../utils/mapIcons";

// Setup marker icon override
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function SearchByRadius() {
  const { mapRef } = useMap();
  const [items, setItems] = useState([]);
  const [center, setCenter] = useState([32.0853, 34.7818]); // Tel Aviv default
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Fetch items on map click
  useEffect(() => {
    if (!clicked) return;

    const fetchNearbyItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/items/nearby`, {
          params: {
            lng: center[1],
            lat: center[0],
            radius: 1500
          }
        });
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyItems();
  }, [center, clicked]);

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
          🖱️ Click on the map to search lost/found items within 1.5 km
        </div>
      )}

      {loading && (
        <div className={styles.loadingBox}>Loading nearby items...</div>
      )}

      {clicked && (
        <Circle
          center={center}
          radius={1500}
          pathOptions={{ color: "blue", fillOpacity: 0.1 }}
        />
      )}

      {items.map((item) => (
        <Marker
          key={item._id}
          position={[
            item.location.coordinates[1],
            item.location.coordinates[0]
          ]}
          icon={mapIcons[item.item_type?.type || "lost"]}
        >
          <Popup>
            <strong>{item.item_category}</strong>
            <br />
            {new Date(item.item_type.dateReported).toLocaleString()}
            <br />
            {item.item_description}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
