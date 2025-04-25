// pages/items/ItemCard.jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { mapIcons } from '../../utils/mapIcons';
import 'leaflet/dist/leaflet.css'
import styles from '../../styles/items.module.css';

const ItemCard = ({ item, onDelete, isOwner, inPopup }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedItemId = searchParams.get('item');
  const isHighlighted = item._id === highlightedItemId;
  const markerIcon = item.item_type.type === 'lost' ? mapIcons.lost : mapIcons.found;

  const handleTitleClick = () => {
    navigate(`/map-tools?item=${item._id}&zoom=true&preview=true`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item._id);
    }
  };

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemImageContainer}>
        <div className={`${styles.itemType} ${styles[item.item_type.type]}`}>
          {item.item_type.type.toUpperCase()}
        </div>
        {item.location && item.location.coordinates && (
          <div 
            className={styles.mapPreviewContainer}
            onClick={handleTitleClick}
            style={{ cursor: 'pointer' }}
          >
            <MapContainer
              center={[item.location.coordinates[1], item.location.coordinates[0]]}
              zoom={15}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              attributionControl={false}
              className={styles.mapPreview}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker 
                position={[
                  item.location.coordinates[1], 
                  item.location.coordinates[0]
                ]} 
                icon={markerIcon}
              />
            </MapContainer>
          </div>
        )}
      </div>
      
      <div className={styles.itemGrid}>
        <h3 
          className={styles.itemTitle}
          onClick={handleTitleClick}
        >
          {item.title}
        </h3>

        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>Category:</span>
          <span className={styles.itemValue}>{item.item_category}</span>
        </div>

        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>Description:</span>
          <span className={styles.itemValue}>{item.item_description}</span>
        </div>

        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>Address:</span>
          <span className={styles.itemValue}>{item.address}</span>
        </div>

        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>Contact:</span>
          <span className={styles.itemValue}>{item.owner_name}</span>
        </div>

        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>Tel:</span>
          <span className={styles.itemValue}>{item.telephone}</span>
        </div>

        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>Reported:</span>
          <span className={styles.itemValue}>
            {new Date(item.item_type.dateReported).toLocaleDateString()}
          </span>
        </div>
        
        {isOwner && !inPopup && (
          <div className={styles.itemFooter}>
            <div className={styles.itemActions}>
              <button 
                className={styles.deleteItem}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;