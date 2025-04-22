import { useState } from "react";
import { useMap } from "../map/MapProvider";
import { useMapEvents, Polygon } from "react-leaflet";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import ItemClusterGroup from './ItemClusterGroup';

export default function SearchByNeighborhood({ filter, active }) {
  const { mapRef } = useMap();

  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const ClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (!active) return; // ✅ Skip logic if inactive
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
          const itemsRes = await api.get(`/neighborhoods/by-neighborhood/${shemshchun}`, {
            params: {
              item_category: filter.item_category || undefined,
              item_type: filter.item_type || undefined,
              resolved: filter.resolved || undefined,
              keywords: filter.keywords || undefined
            }
          });
          
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
          pathOptions={{ 
            color: 'blue',
            weight: 2,
            fillOpacity: 0.1 
          }}
        />
      )}

      {items.length > 0 && <ItemClusterGroup items={items} />}

      {/* <div className={styles.infoBox}>
        {neighborhoodName && (
          <>
            <h3>{neighborhoodName}</h3>
            <p>Items found: {items.length}</p>
            <p>
              Lost items: {items.filter(item => item.item_type?.type === 'lost').length}<br />
              Found items: {items.filter(item => item.item_type?.type === 'found').length}
            </p>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div> */}
    </>
  );
}