import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mapIcons } from '../../utils/mapIcons';
import 'leaflet/dist/leaflet.css'
import styles from '../../styles/items.module.css';

const ItemCard = ({ item, onDelete, isOwner }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedItemId = searchParams.get('item');

  // Check if this item is highlighted
  const isHighlighted = item._id === highlightedItemId;

  // Get the appropriate icon based on item type
  const markerIcon = item.item_type.type === 'lost' ? mapIcons.lost : mapIcons.found;

  return (
      <div className={styles.itemCard}>
          <div className={styles.itemImage}>
              <div className={`${styles.itemStatus} ${styles[item.item_type.type]}`}>
                  {item.item_type.type.toUpperCase()}
              </div>
              {item.location && item.location.coordinates && (
                  <div className={styles.itemMapPreview}>
                      <MapContainer
                          center={[item.location.coordinates[1], item.location.coordinates[0]]}
                          zoom={15}
                          zoomControl={false}
                          dragging={false}
                          scrollWheelZoom={false}
                          doubleClickZoom={false}
                      >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker 
                              position={[
                                  item.location.coordinates[1], 
                                  item.location.coordinates[0]
                              ]} 
                              icon={markerIcon}
                          >
                              <Popup>
                                  <div className={`${styles.itemPopup} ${isHighlighted ? styles.highlightedPopup : ''}`}>
                                      {isHighlighted && (
                                          <div className={styles.highlightedBadge}>
                                              Selected Item
                                          </div>
                                      )}
                                      <h4>{item.title}</h4>
                                      <p>{item.item_description}</p>
                                      <p>Location: {item.address}</p>
                                  </div>
                              </Popup>
                          </Marker>
                      </MapContainer>
                  </div>
              )}
          </div>
          <div className={styles.itemContent}>
              <h3>{item.title}</h3>
              <p className={styles.itemCategory}>Category: {item.item_category}</p>
              {item.item_description && (
                  <p className={styles.itemDescription}>{item.item_description}</p>
              )}
              <p className={styles.itemAddress}>{item.address}</p>
              <p className={styles.itemContact}>
                  Contact: {item.owner_name} ({item.telephone})
              </p>
              <p className={styles.itemStatus}>
                  Status: {item.item_type.resolved ? 'Resolved' : 'Active'}
              </p>
              {item.item_type.dateReported && (
                  <p className={styles.itemDate}>
                      Reported: {new Date(item.item_type.dateReported).toLocaleDateString()}
                  </p>
              )}
              <div className={styles.itemActions}>
                  <button 
                      className={styles.viewOnMap}
                      onClick={() => navigate(`/items/map?item=${item._id}&zoom=true`)}
                  >
                      View on Map
                  </button>
                  {isOwner && (
                      <button 
                          className={styles.deleteItem}
                          onClick={() => onDelete(item._id)}
                      >
                          Delete
                      </button>
                  )}
              </div>
          </div>
      </div>
  );
};

export default ItemCard;