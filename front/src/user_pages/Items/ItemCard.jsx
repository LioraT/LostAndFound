import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mapIcons } from '../../utils/mapIcons';
import 'leaflet/dist/leaflet.css'
import '../../styles/items.module.css';

const ItemCard = ({ item, onDelete, isOwner }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedItemId = searchParams.get('item');

  // Check if this item is highlighted
  const isHighlighted = item._id === highlightedItemId;

  // Get the appropriate icon based on item type
  const markerIcon = item.item_type.type === 'lost' ? mapIcons.lost : mapIcons.found;

  return (
      <div className="item-card">
          <div className="item-image">
              <div className={`item-status ${item.item_type.type}`}>
                  {item.item_type.type.toUpperCase()}
              </div>
              {item.location && item.location.coordinates && (
                  <div className="item-map-preview">
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
                                  <div className={`item-popup ${isHighlighted ? 'highlighted-popup' : ''}`}>
                                      {isHighlighted && (
                                          <div className="highlighted-badge">
                                              Selected Item
                                          </div>
                                      )}
                                      {/* ... rest of your popup content ... */}
                                  </div>
                              </Popup>
                          </Marker>
                      </MapContainer>
                  </div>
              )}
          </div>
          <div className="item-content">
              <h3>{item.title}</h3>
              <p className="item-category">Category: {item.item_category}</p>
              {item.item_description && (
                  <p className="item-description">{item.item_description}</p>
              )}
              <p className="item-address">{item.address}</p>
              <p className="item-contact">
                  Contact: {item.owner_name} ({item.telephone})
              </p>
              <p className="item-status">
                  Status: {item.item_type.type ? 'lost' : 'found'}
              </p>
              <div className="item-actions">
                  <button 
                      className="view-on-map"
                      onClick={() => navigate(`/items/map?item=${item._id}&zoom=true`)}
                  >
                      View on Map
                  </button>
                  {isOwner && (
                      <button 
                          className="delete-property"
                          onClick={() => onDelete(property._id)}
                      >
                          Delete
                      </button>
                  )}
              </div>
          </div>
      </div>
  );
};

export default PropertyCard;