import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Marker, Popup, useMap } from 'react-leaflet';
import { mapIcons } from '../../utils/mapIcons';
import api from '../../api/axios';
import ItemCard from '../../pages/Items/ItemCard';

export default function ItemZoom() {
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const map = useMap();

  const itemId = searchParams.get('item');
  const shouldZoom = searchParams.get('zoom') === 'true';
  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const { data } = await api.get(`/items/id/${itemId}`);
          setSelectedItem(data);
          
          // If zoom parameter is true, center the map on this item
          if (shouldZoom && data.location && data.location.coordinates) {
            map.setView(
              [data.location.coordinates[1], data.location.coordinates[0]],
              15,
              { animate: true }
            );
          }
        } catch (err) {
          console.error('Error fetching item:', err);
        }
      };

      fetchItem();
    }
  }, [itemId, shouldZoom, map]);

  if (!selectedItem || !selectedItem.location) return null;

  const markerIcon = selectedItem.item_type.type === 'lost' 
    ? mapIcons.lostHighlighted 
    : mapIcons.foundHighlighted;

  return (
    <Marker
      position={[
        selectedItem.location.coordinates[1],
        selectedItem.location.coordinates[0]
      ]}
      icon={markerIcon}
    >
      <Popup maxWidth={300} maxHeight={400}>
        <ItemCard item={selectedItem} inPopup={true} />
      </Popup>
    </Marker>
  );
}