import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Polygon, Marker, Popup } from 'react-leaflet';
import api from '../api/axios';
import styles from '../styles/theme.module.css';
import 'leaflet/dist/leaflet.css';
import { useAuth } from "../context/AuthContext";
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
  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const { token } = useAuth();
  
  const handleMapClick = async (coords) => {
    if (!token) {
      setError("User not authenticated");
      return;
    }
    try {
      const { data } = await api.post(`${API_URL}/neighborhoods/find-by-coordinates`,
        { lng: coords[0], lat: coords[1] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
        {highlightedPolygon && <Polygon positions={highlightedPolygon} />}
        {items.map((item, index) => (
        <Marker 
          key={index} 
          position={[item.location.coordinates[1], item.location.coordinates[0]]}
          icon={L.icon({ iconUrl: '/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}
          >
          <Popup>
            <div>
              <strong>{item.item_category}</strong><br />
              {new Date(item.item_type.dateReported).toLocaleDateString()}<br />
              {item.item_description} 
            </div>
          </Popup>
        </Marker>
        ))}
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
