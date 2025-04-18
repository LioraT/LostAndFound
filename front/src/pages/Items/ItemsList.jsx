import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import styles from '../../styles/items.module.css';
import ItemCard from './ItemCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const ItemsList = () => {

    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/items');
            console.log('Items received:', response.data);
            setItems(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching items:', {
                status: err.response?.status,
                message: err.response?.data?.error
            });
            setError(err.response?.data?.error || 'Failed to fetch items');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/items/${itemId}`);
            setItems(items.filter(i => i._id !== itemId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete item');
        }
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    if (loading) return <div className={styles.loading}>Loading items...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.itemsPage}>
            <div className={styles.itemsHeader}>
                <div className={styles.headerControls}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.searchInput}
                        />
                    </div>

                </div>
            </div>

            <div className={styles.itemsGrid}>
                {currentItems.map(item => {
                    console.log('Current item:', item);
                    console.log('User:', user);
                    return (
                        <ItemCard 
                            key={item._id}
                            item={item}
                            onDelete={handleDelete}
                            isOwner={user?._id && item?.owner?.toString() === user._id.toString()}
                        />
                    );
                })}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? styles.active : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ItemsList;