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
import ItemCard from '../../pages/Items/ItemCard';

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
    const className = `clusterIcon${type.charAt(0).toUpperCase() + type.slice(1)}`;
    return L.divIcon({
      html: `
        <div class="${styles.clusterIcon} ${styles[className]}">
          ${count}
        </div>
      `,
      className: '',
      iconSize: L.point(36, 36),
      iconAnchor: [18, 18]
    });
  };
};

// Reusable ItemMarkerCluster component
const ItemMarkerCluster = ({ items, type, selectedItem, onSelectItem }) => (
  <MarkerClusterGroup
    chunkedLoading
    maxClusterRadius={60}
    showCoverageOnHover={false}
    zoomToBoundsOnClick={true}
    spiderfyOnMaxZoom={true}
    removeOutsideVisibleBounds={true}
    iconCreateFunction={createClusterIcon(type)}
  >
    {items.map((item) => (
      <Marker
        key={item._id}
        position={[item.location.coordinates[1], item.location.coordinates[0]]}
        icon={selectedItem === item._id ? mapIcons[`${type}Highlighted`] : mapIcons[type]}
        eventHandlers={{
          click: () => onSelectItem(item._id),
          mouseover: () => onSelectItem(item._id),
          mouseout: () => onSelectItem(null),
        }}
      >
        <Popup maxWidth={300} maxHeight={400}>
          <ItemCard item={item} inPopup={true} />
        </Popup>
      </Marker>
    ))}
  </MarkerClusterGroup>
);

export default function ItemClusterGroup({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // Separate items by type
  const lostItems = items.filter(item => item.item_type?.type === 'lost');
  const foundItems = items.filter(item => item.item_type?.type === 'found');

  return (
    <>
      <ItemMarkerCluster 
        items={lostItems}
        type="lost"
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
      />
      <ItemMarkerCluster 
        items={foundItems}
        type="found"
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
      />
    </>
  );
}