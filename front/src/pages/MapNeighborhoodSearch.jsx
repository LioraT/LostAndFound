import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, useMapEvents, Polygon, Marker, Popup } from 'react-leaflet';
import api from '../api/axios';
import styles from '../styles/theme.module.css';
import 'leaflet/dist/leaflet.css';
import { mapIcons } from '../utils/mapIcons';
import L from 'leaflet';

const API_URL = process.env.REACT_APP_API_URL;

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick([lng, lat]); // [lng, lat]
    }
  });
  return null;
}

export default function MapNeighborhoodSearch() {
  const [searchParams] = useSearchParams();
  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get item ID from URL parameters
  const itemId = searchParams.get('item');
  const shouldZoom = searchParams.get('zoom') === 'true';

  // Fetch specific item when component mounts if itemId is provided
  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const { data } = await api.get(`/items/id/${itemId}`);
          setSelectedItem(data);
          setItems([data]); // Add the item to the items array
          
          // If zoom parameter is true, center the map on this item
          if (shouldZoom && data.location && data.location.coordinates) {
            // You'll need to get a reference to the map to set its view
            // This will be handled by a separate map control component
          }
        } catch (err) {
          console.error('Error fetching item:', err);
          setError('Failed to fetch item');
        }
      };

      fetchItem();
    }
  }, [itemId, shouldZoom]);

  const handleMapClick = async (coords) => {
    try {
      const { data } = await api.post(`${API_URL}/neighborhoods/find-by-coordinates`, {
        lng: coords[0], 
        lat: coords[1]
      });

//new chages
      const shemshchun = data.shemshchun;
      setNeighborhoodName(data.shemshchun);
      setError('');
      
      await fetchPolygon(data.shemshchun); // optional for highlight
      await fetchItems(data.shemshchun);   //fetchItems 
      //fetchItemsInNeighborhood(data.shemshchun);

    } catch (err) {
      console.error(err);
      setNeighborhoodName('');
      setHighlightedPolygon(null);
      setError(err.response?.data?.error || 'Neighborhood not found');
    }
  };

  const fetchPolygon = async (shemshchun) => {
    try {
      const { data } = await api.get(`${API_URL}/neighborhoods/by-name/${encodeURIComponent(shemshchun)}`);
      const polygon = data.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
      setHighlightedPolygon(polygon);
    } catch (err) {
      console.error('Error fetching polygon', err);
    }
  };

  //fetch items
  const fetchItems = async (shemshchun) => {
    try {
      const { data } = await api.get(`${API_URL}/neighborhoods/by-neighborhood/${encodeURIComponent(shemshchun)}`);
      setItems(data); // Set item array
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };


  
  return (
    <div>
    <div className={styles.mapContainer}>
      <MapContainer
        center={[32.0853, 34.7818]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={handleMapClick} />
        {/* zoom to the marker  */}
        <MapControl item={selectedItem} shouldZoom={shouldZoom} />
        {highlightedPolygon && <Polygon positions={highlightedPolygon} />}
        {items.map((item, index) => {
          const isHighlighted = item._id === itemId;
          const icon = item.item_type.type === 'lost' 
            ? (isHighlighted ? mapIcons.lostHighlighted : mapIcons.lost)
            : (isHighlighted ? mapIcons.foundHighlighted : mapIcons.found);

          return (
            <Marker 
              key={item._id || index}
              position={[item.location.coordinates[1], item.location.coordinates[0]]}
              icon={icon}
            >
              <Popup>
                <div>
                  <strong>{item.title}</strong><br />
                  Category: {item.item_category}<br />
                  Status: {item.item_type.type.toUpperCase()}<br />
                  Date: {new Date(item.item_type.dateReported).toLocaleDateString()}<br />
                  Description: {item.item_description}<br />
                  Contact: {item.owner_name} ({item.telephone})
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>

    <div className={styles.infoBox}>
      <p>This is the info box.</p>
      {neighborhoodName && (
        <p>
        Neighborhood: {neighborhoodName}<br />
        Items found: {items.length}
      </p>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  </div>
  );   
}

// Add a map control component to handle zooming to the selected item
function MapControl({ item, shouldZoom }) {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (item && shouldZoom && item.location && item.location.coordinates) {
      map.setView(
        [item.location.coordinates[1], item.location.coordinates[0]],
        15,
        { animate: true }
      );
    }
  }, [item, shouldZoom, map]);

  return null;
}
