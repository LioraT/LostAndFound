import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "../../styles/theme.module.css";
import ItemClusterGroup from './ItemClusterGroup';

export default function AllItemsView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/items/');
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  return (
    <>
      {loading && (
        <div className={styles.loadingBox}>
          Loading items...
        </div>
      )}
      <ItemClusterGroup items={items} />
    </>
  );
}