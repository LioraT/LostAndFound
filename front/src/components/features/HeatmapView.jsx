import { useEffect, useState } from "react";
import { useMap } from "../map/MapProvider";
import { LayersControl, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import { heatmapConfigs, layerNames } from "../../utils/heatmapConfig";

const { Overlay } = LayersControl;

// Add this check after the imports to verify the plugin is loaded
if (!L.heatLayer) {
  console.error("Leaflet.heat not loaded!");
}

export default function HeatmapView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapContext = useMap();
  
  // Use useMapEvents to get direct access to the map instance
  const map = useMapEvents({
    click: async (e) => {
      try {
        const { lat, lng } = e.latlng;
        
        // Using axios instead of fetch
        const response = await api.post('/neighborhoods/find-by-coordinates', 
          { lat, lng },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true // Enable sending cookies
          }
        );
        
        console.log('Neighborhood response:', response.data);
      } catch (err) {
        console.error('Error finding neighborhood:', err.response?.data || err.message);
      }
    }
  });

  // Fetch all items when component mounts
  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/items/');
        const validItems = response.data.filter(item => 
          item.location && 
          item.location.coordinates && 
          item.location.coordinates.length === 2
        );
        
        setItems(validItems);
        console.log('Fetched items for heatmap:', validItems.length);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Create and manage heatmap layers
  useEffect(() => {
    if (!map || !items.length) {
      console.log('Map or items not ready:', { hasMap: !!map, itemCount: items.length });
      return;
    }

    // Prepare data for heatmaps
    const lostPoints = items
      .filter(item => item.item_type.type === 'lost')
      .map(item => [
        item.location.coordinates[1],
        item.location.coordinates[0],
        0.5 // intensity
      ]);

    const foundPoints = items
      .filter(item => item.item_type.type === 'found')
      .map(item => [
        item.location.coordinates[1],
        item.location.coordinates[0],
        0.5 // intensity
      ]);

    // Create heatmap layers using configurations
    const lostHeatLayer = L.heatLayer(lostPoints, heatmapConfigs.lost);
    const foundHeatLayer = L.heatLayer(foundPoints, heatmapConfigs.found);

    // Add layers to the map
    lostHeatLayer.addTo(map);
    foundHeatLayer.addTo(map);

    // Add layer controls using layerNames from config
    const layerControl = L.control.layers(null, {
      [layerNames.lost]: lostHeatLayer,
      [layerNames.found]: foundHeatLayer
    }, { position: 'topright' }).addTo(map);

    return () => {
      map.removeLayer(lostHeatLayer);
      map.removeLayer(foundHeatLayer);
      map.removeControl(layerControl);
    };
  }, [map, items]);

  return (
    <>
      {loading && (
        <div className={styles.loadingBox}>
          Loading heatmap data...
        </div>
      )}
    </>
  );
}