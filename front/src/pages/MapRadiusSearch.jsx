import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import api from '../api/axios';
import styles from '../styles/theme.module.css';

// Fix marker icons (React + Leaflet)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


//const API_URL = process.env.REACT_APP_API_URL;
const MapRadiusSearch = () => {
  const [items, setItems] = useState([]);
  const [center, setCenter] = useState([32.0853, 34.7818]); // Default: Tel Aviv
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  //const token = localStorage.getItem('token');

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
        console.error('Error fetching items:', err.message);
      } finally {
        setLoading(false);
      }
    };
   /* const fetchNearby = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/protected/properties/nearby?lng=${center[1]}&lat=${center[0]}&radius=3000`, {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("after fetch", res);
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error.message);
      } finally {
        setLoading(false);
      }
    };*/

    fetchNearbyItems();
  }, [center, clicked ]); //add token?

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
    <div className={styles.mapWrapper}>
      {clicked && (
        <div className={styles.mapHint}>
          🖱️ Click on the map to search lost/found items within 1.5 km
        </div>
      )}
      {loading && (
        <div className={styles.loadingBox}>
          Loading nearby items...
        </div>
      )}

      <MapContainer center={center} zoom={13} className={styles.mapContainer}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler />
        {clicked && (
          <Circle center={center} radius={1500} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
        )}

        {items.map((item) => (
          <Marker
            key={item._id}
            position={[item.location.coordinates[1], item.location.coordinates[0]]}
          >
            <Popup>
              <strong>{item.item_category}</strong><br />
              {new Date(item.item_type.dateReported).toLocaleString()}<br />
              {item.item_description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapRadiusSearch;
