import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Polygon } from 'react-leaflet';
import api from '../api/axios';
import styles from '../styles/theme.module.css';
import 'leaflet/dist/leaflet.css';
import { useAuth } from "../context/AuthContext";

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
  const [error, setError] = useState('');
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  const handleMapClick = async (coords) => {
    try {
      const { data } = await api.post(`${API_URL}/neighborhoods/find-by-coordinates`,
        {
          lng: coords[0],
          lat: coords[1],
        });

      setNeighborhoodName(data.shemshchun);
      setError('');
      fetchPolygon(data.shemshchun); // optional for highlight
      console.log("neg",data.shemshchun);
      fetchItemsInNeighborhood(data.shemshchun);
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



  const fetchItemsInNeighborhood = async (shemshchun) => {
    try {
      const { data } = await api.get(`${API_URL}/neighborhoods/by-neighborhood/${encodeURIComponent(shemshchun)}`);
      setItems(data);
    } catch (err) {
      console.error('Error fetching items', err);
      setItems([]);
    }
  };


  return (
    <div>
    <div className={styles.mapContainer}>
      <MapContainer
        center={[32.0853, 34.7818]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={handleMapClick} />
        {highlightedPolygon && <Polygon positions={highlightedPolygon} />}
      </MapContainer>
    </div>

    <div className={styles.infoBox}>
      <p>This is the info box.</p>
      {neighborhoodName && <p>Neighborhood: {neighborhoodName}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  </div>
   /* <div className={styles.mapContainer}>
    <MapContainer center={[32.0853, 34.7818]} zoom={13} className={styles.mapBox}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onClick={handleMapClick} />
      {highlightedPolygon && <Polygon positions={highlightedPolygon} />}
    </MapContainer>
  
    <div className={styles.infoBox}>
      {neighborhoodName && <p><strong>Neighborhood:</strong> {neighborhoodName}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {items.length > 0 ? (
        <>
          <h3>Items in this neighborhood:</h3>
          <ul className={styles.itemList}>
            {items.map((item) => (
              <li key={item._id}>
                <strong>{item.item_type.type.toUpperCase()}:</strong> {item.title}<br />
                <em>{item.item_description}</em> ({item.item_category})<br />
                Phone: {item.telephone}
              </li>
            ))}
          </ul>
        </>
      ) : neighborhoodName && <p>No items reported in this neighborhood.</p>}
    </div>
  </div>*/
  
  );    
  
}
