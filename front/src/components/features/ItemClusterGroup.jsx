// components/features/ItemClusterGroup.jsx
import { useState } from 'react';
import L from 'leaflet';
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import { mapIcons } from "../../utils/mapIcons";
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import styles from "../../styles/theme.module.css";

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create custom cluster icons for lost and found items
const createClusterIcon = (type) => {
  return (cluster) => {
    const count = cluster.getChildCount();
    const backgroundColor = type === 'lost' ? '#ff4444' : '#4CAF50';
    
    return L.divIcon({
      html: `
        <div class="custom-cluster-icon" style="
          background-color: ${backgroundColor};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.5);
        ">
          ${count}
        </div>
      `,
      className: '',
      iconSize: L.point(36, 36),
      iconAnchor: [18, 18]
    });
  };
};

export default function ItemClusterGroup({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // Separate items by type
  const lostItems = items.filter(item => item.item_type?.type === 'lost');
  const foundItems = items.filter(item => item.item_type?.type === 'found');

  return (
    <>
      {/* Lost Items Cluster */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={30}
        minZoom={3}
        maxZoom={18}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={16}
        iconCreateFunction={createClusterIcon('lost')}
      >
        {lostItems.map((item) => (
          <Marker
            key={item._id}
            position={[item.location.coordinates[1], item.location.coordinates[0]]}
            icon={selectedItem === item._id ? mapIcons.lostHighlighted : mapIcons.lost}
            eventHandlers={{
              click: () => setSelectedItem(item._id),
              mouseover: () => setSelectedItem(item._id),
              mouseout: () => setSelectedItem(null),
            }}
          >
            <Popup>
              <div className={styles.itemPopup}>
                <strong>{item.item_type?.type?.toUpperCase()}</strong><br />
                <span className={styles.itemCategory}>{item.item_category}</span><br />
                {item.item_description}<br />
                <span className={styles.itemDate}>
                  {new Date(item.item_type?.dateReported).toLocaleString()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* Found Items Cluster */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        spiderfyOnMaxZoom={true}
        removeOutsideVisibleBounds={true}
        iconCreateFunction={createClusterIcon('found')}
      >
        {foundItems.map((item) => (
          <Marker
            key={item._id}
            position={[item.location.coordinates[1], item.location.coordinates[0]]}
            icon={selectedItem === item._id ? mapIcons.foundHighlighted : mapIcons.found}
            eventHandlers={{
              click: () => setSelectedItem(item._id),
              mouseover: () => setSelectedItem(item._id),
              mouseout: () => setSelectedItem(null),
            }}
          >
            <Popup>
              <div className={styles.itemPopup}>
                <strong>{item.item_type?.type?.toUpperCase()}</strong><br />
                <span className={styles.itemCategory}>{item.item_category}</span><br />
                {item.item_description}<br />
                <span className={styles.itemDate}>
                  {new Date(item.item_type?.dateReported).toLocaleString()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </>
  );
}
