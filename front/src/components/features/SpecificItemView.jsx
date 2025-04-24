import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { mapIcons } from "../../utils/mapIcons";
import styles from "../../styles/theme.module.css";
import { findMatchingItems } from "./MatchItems";
import api from "../../api/axios";
import ItemCard from '../../pages/Items/ItemCard';

export default function SpecificItemView({ filter }) {
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [matchItems, setMatchItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const map = useMap();

  const itemId = searchParams.get('item');
  const shouldZoom = searchParams.get('zoom') === 'true';

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const { data } = await api.get(`/items/id/${itemId}`);
          setSelectedItem(data);
          
          if (data.location && data.location.coordinates) {
            if (shouldZoom) {
              map.setView(
                [data.location.coordinates[1], data.location.coordinates[0]],
                15,
                { animate: true }
              );
            }

            const matches = await findMatchingItems({
              type: data.item_type.type,
              category: data.item_category,
              coordinates: data.location.coordinates,
              radius: 1500
            });
            setMatchItems(matches);
          }
        } catch (err) {
          console.error('Error fetching item:', err);
        }
      };

      fetchItem();
    }
  }, [itemId, shouldZoom, map]);

  return (
    <>
      {loading && (
        <div className={styles.loadingBox}>
          Finding matches...
        </div>
      )}
      
      {selectedItem && selectedItem.location && (
        <Marker
          position={[
            selectedItem.location.coordinates[1],
            selectedItem.location.coordinates[0]
          ]}
          icon={selectedItem.item_type.type === 'lost' 
            ? mapIcons.lostHighlighted 
            : mapIcons.foundHighlighted}
        >
          <Popup maxWidth={300} maxHeight={400}>
            <ItemCard item={selectedItem} inPopup={true} />
          </Popup>
        </Marker>
      )}

      {matchItems.map((item) => (
        <Marker
          key={item._id}
          position={[item.location.coordinates[1], item.location.coordinates[0]]}
          icon={mapIcons[item.item_type?.type || "lost"]}
        >
          <Popup>
            <strong>{item.item_category}</strong><br />
            {item.item_description}<br />
            {new Date(item.item_type?.dateReported).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
