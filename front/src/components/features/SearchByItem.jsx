// components/features/SearchByItem.jsx

import { useEffect, useState, useContext } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { MapContext } from "../map/MapProvider";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import { mapIcons } from "../../utils/mapIcons";
import ItemCard from "../../pages/Items/ItemCard";
import { findMatchingItems } from "./MatchItems";
import ItemClusterGroup from "./ItemClusterGroup";  // ✅ Added import

export default function SearchByItem({ itemId, radius }) {
  const [item, setItem] = useState(null);
  const [matchItems, setMatchItems] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const map = useMap();
  const { mode } = useContext(MapContext);

  useEffect(() => {
    if (mode !== "focus") return;

    const fetchItemAndMatches = async () => {
      try {
        const { data } = await api.get(`/items/id/${itemId}`);

        setItem(data);
        console.log("Current user:", user?._id);
        console.log("got data: ", data);


        if (data.location && data.location.coordinates) {
          const [lng, lat] = data.location.coordinates;
          map.flyTo([lat, lng], 14);

          const matches = await findMatchingItems({
            type: data.item_type.type,
            category: data.item_category,
            coordinates: data.location.coordinates,
            radius: radius
          });
          setMatchItems(matches);
        }
      } catch (err) {
        console.error("Error fetching item or matches:", err);
        setError("Failed to load item or matches.");
      }
    };

    if (itemId && radius) {
      fetchItemAndMatches();
    }
  }, [itemId, radius, mode, map]);

  const renderStatusButton = () => (
    <div className={styles.statusButtonActive}>
      Focus Mode: Active
    </div>
  );

  if (mode !== "focus") return null;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!item) return <div>Loading item...</div>;

  const markerIcon = item.item_type.type === 'lost'
    ? mapIcons.lostHighlighted
    : mapIcons.foundHighlighted;

  return (
    <>
      {renderStatusButton()}
      <div className={styles.searchHeader}>
        <h3>Focused on: {item.item_category} - {item.item_description}</h3>
        <p>Searching within radius: {radius} meters</p>
      </div>

      {/* Focused item marker */}
      <Marker
        position={[item.location.coordinates[1], item.location.coordinates[0]]}
        icon={markerIcon}
      >
        <Popup maxWidth={300} maxHeight={400}>
          <ItemCard item={item} inPopup={true} />
        </Popup>
      </Marker>

      {/* Matching items rendered via ItemClusterGroup */}
      <ItemClusterGroup
        items={matchItems}
        matchingContext={{
          mainItem: item,
          matchingEnabled:
            item.item_type.type === "found" &&
            item.owner._id === user._id &&
            !item.item_type.resolved
        }}
      />
    </>
  );
}
