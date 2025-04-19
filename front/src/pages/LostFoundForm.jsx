import React, { useState } from 'react';
import styles from '../styles/theme.module.css';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function LostFoundForm({ coordinates }) {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    telephone: '',
    item_type: 'lost', // ✅ Default to 'lost'
    dateReported: new Date().toISOString().slice(0, 16), // ✅ Editable date field, pre-filled
    title: '',
    item_category: '',
    item_description: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("User not authenticated");

    const item = {
        owner_name: user?.username || "guest", // fallback if needed
        telephone: formData.telephone,
        title: formData.title,
        item_category: formData.item_category,
        item_description: formData.item_description,
        item_type: {
          type: formData.isLost ? "lost" : "found",
          dateReported: formData.dateReported,
        },
        address: formData.address,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        }
    }
    try {
      const { data } = await api.put('/items', payload); //axios interceptor handles it
      console.log("Submitted Data:", data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Phone:
        <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required />
      </label>

      {/* ✅ Radio buttons for lost/found */}
      <div className={styles.radioGroup}>
        <label>
          <input type="radio" name="item_type" value="lost" checked={formData.item_type === 'lost'} onChange={handleChange} />
          Lost
        </label>
        <label>
          <input type="radio" name="item_type" value="found" checked={formData.item_type === 'found'} onChange={handleChange} />
          Found
        </label>
      </div>

      {/* ✅ Editable date field with pre-filled current date */}
      <label>
        Date:
        <input
          type="datetime-local"
          name="dateReported"
          value={formData.dateReported}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Item Category:
        <select name="item_category" value={formData.item_category} onChange={handleChange} required>
          <option value="">--Select--</option>
          <option value="keys">Keys</option>
          <option value="wallet">Wallet</option>
          <option value="phone">Phone</option>
          <option value="jewelry">Jewelry</option>
          <option value="bag">Bag</option>
          <option value="headphones">Headphones</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Description:
        <textarea name="item_description" value={formData.item_description} onChange={handleChange} required />
      </label>

      <label>
        Address:
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}