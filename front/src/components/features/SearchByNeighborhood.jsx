// SearchByNeighborhood.jsx
import { useState, useEffect, useContext } from 'react';
import { useMap, MapContext } from "../map/MapProvider";
import { useMapEvents, Polygon } from "react-leaflet";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import ItemClusterGroup from './ItemClusterGroup';

export default function SearchByNeighborhood({ filter }) {
  const { mapRef } = useMap();
  const { defaultCoordinates, mode } = useContext(MapContext);

  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle default coordinates or map clicks
  const handleCoordinates = async (coords) => {
    try {
      const response = await api.post('/neighborhoods/find-by-coordinates', coords);
      
      if (response.data.shemshchun) {
        setNeighborhoodName(response.data.shemshchun);
        await fetchPolygon(response.data.shemshchun);
        await fetchItems(response.data.shemshchun);
      }
    } catch (err) {
      console.error("Error processing coordinates:", err);
    }
  };

  // Fetch polygon for neighborhood
  const fetchPolygon = async (shemshchun) => {
    try {
      const { data } = await api.get(`/neighborhoods/by-name/${encodeURIComponent(shemshchun)}`);
      const polygon = data.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
      setHighlightedPolygon(polygon);
    } catch (err) {
      console.error('Error fetching polygon:', err);
    }
  };

  // Fetch items in neighborhood
  const fetchItems = async (shemshchun) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/neighborhoods/by-neighborhood/${encodeURIComponent(shemshchun)}`, {
        params: {
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

  // Handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (mode === "neighborhood") {
          handleCoordinates({ lng: e.latlng.lng, lat: e.latlng.lat });
        }
      }
    });
    return null;
  };

  // Handle default coordinates when mode changes
  useEffect(() => {
    if (mode === "neighborhood" && defaultCoordinates) {
      handleCoordinates(defaultCoordinates);
    }
  }, [defaultCoordinates, mode]);

  return (
    <>
      <MapClickHandler />
      {loading && (
        <div className={styles.loadingBox}>
          Loading neighborhood data...
        </div>
      )}
      {highlightedPolygon && (
        <Polygon
          positions={highlightedPolygon}
          pathOptions={{
            color: 'blue',
            weight: 2,
            fillOpacity: 0.1
          }}
        />
      )}
      <ItemClusterGroup items={items} />
      {neighborhoodName && (
        <div className={styles.mapMessage}>
          Showing items in {neighborhoodName}
        </div>
      )}
    </>
  );
}