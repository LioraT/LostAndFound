import { useState } from "react";
import { useMap } from "../map/MapProvider";
import { useMapEvents, Marker, Polygon, Popup } from "react-leaflet";
import api from "../../api/axios";
import L from "leaflet";
import { mapIcons } from "../../utils/mapIcons";
import styles from "../../styles/theme.module.css";

export default function SearchByNeighborhood() {
  const { mapRef } = useMap();

  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const ClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        setError('');
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        try {
          // Step 1: Get neighborhood name
          const nameRes = await api.post('/neighborhoods/find-by-coordinates', { lat, lng });
          const { shemshchun } = nameRes.data || {};

          if (!shemshchun) {
            setError("Neighborhood not found.");
            setNeighborhoodName('');
            setHighlightedPolygon(null);
            setItems([]);
            return;
          }

          setNeighborhoodName(shemshchun);

          // Step 2: Get neighborhood polygon
          const polyRes = await api.get(`/neighborhoods/by-name/${shemshchun}`);
          const geometry = polyRes.data?.geometry;

          if (!geometry?.coordinates?.[0]) {
            setError("Neighborhood geometry not found.");
            setHighlightedPolygon(null);
            return;
          }

          setHighlightedPolygon(geometry.coordinates[0]);

          // Step 3: Get items in neighborhood
          const itemsRes = await api.get(`/neighborhoods/by-neighborhood/${shemshchun}`);
          setItems(itemsRes.data || []);

        } catch (err) {
          console.error("Search error:", err);
          setError("Error fetching data.");
        }
      }
    });
    return null;
  };

  return (
    <>
      <ClickHandler />

      {highlightedPolygon && (
        <Polygon
          positions={highlightedPolygon.map(([lng, lat]) => [lat, lng])}
          pathOptions={{ color: 'blue' }}
        />
      )}

      {items.map((item, i) => (
        <Marker
          key={i}
          position={[item.location.coordinates[1], item.location.coordinates[0]]}
          icon={mapIcons[item.item_type?.type || 'lost']}
        >
          <Popup>
            <strong>{item.item_type?.type?.toUpperCase()}</strong><br />
            {item.item_description}<br />
            {new Date(item.item_type?.dateReported).toLocaleString()}
          </Popup>
        </Marker>
      ))}

      <div className={styles.infoBox}>
        {neighborhoodName && (
          <>
            <h3>{neighborhoodName}</h3>
            <p>Items found: {items.length}</p>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  );
}
