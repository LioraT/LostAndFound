
import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "../styles/theme.module.css";
import "leaflet/dist/leaflet.css";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";



/*const submitLostFoundItem = async (data) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/lostfound`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if protected route
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit item');
    }

    const result = await response.json();
    console.log("Item submitted:", result);
    alert("Item successfully submitted!");
  } catch (err) {
    console.error("Submission error:", err);
    alert("Error submitting item.");
  }
};*/


// Placeholder icon (optional)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function LostFoundMap() {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [formData, setFormData] = useState({
    telephone: "",
    item_category: "keys",
    item_description: "",
    item_type: "lost", // 'lost' or 'found'
    dateReported: new Date().toISOString().slice(0, 16), // for datetime-local input
  });

  const { token, user } = useAuth(); // our context includes user info like username

  const handleMapClick = (latlng) => {
    setClickedPosition({ ...latlng, date: new Date() });
  };

  /*
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };*/

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    const result = {
      ...formData,
      coordinates: clickedPosition,
      user: localStorage.getItem("token") || "guest",
    };
    console.log("Submitted Lost/Found Item:", result);
    setClickedPosition(null);
    setFormData({ phone: "", item: "keys", description: "", isLost: true });
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to submit.");
      return;
    }

    const data = {
      owner_name: user?.username || "guest",
      telephone: formData.telephone,
      item_type: { type: formData.item_type },
      dateReported: new Date(formData.dateReported),
      resolved: false,
      title: `${formData.item_type} ${formData.item_category}`,
      item_category: formData.item_category,
      item_description: formData.item_description,
      address: "Tel Aviv", // update later if needed
      location: {
        type: "Point",
        coordinates: [clickedPosition.lng, clickedPosition.lat],
      },
    };

    try {
      const res = await api.post("/items/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Submitted Data:", res.data);
      alert("Item logged successfully.");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit item.");
    }

    setClickedPosition(null);
    setFormData({
      telephone: "",
      item_category: "keys",
      item_description: "",
      item_type: "lost",
      dateReported: new Date().toISOString().slice(0, 16),
    });
  };

  return (
    <div className={styles.mapContainer}>
      <MapContainer center={[32.0853, 34.7818]} zoom={13} className={styles.mapContainer}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onMapClick={handleMapClick} />
        {clickedPosition && (
          <Marker position={clickedPosition} icon={markerIcon}>
            <Popup>
              <form onSubmit={handleSubmit} className={styles.popupForm}>
                <p><strong>Coordinates:</strong><br />{clickedPosition.lat.toFixed(5)}, {clickedPosition.lng.toFixed(5)}</p>

                {/* 📅 Editable Date */}
                <label>
                  Date:
                  <input
                    type="datetime-local"
                    name="dateReported"
                    value={formData.dateReported}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Phone:
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Item:
                  <select name="item_category" value={formData.item_category} onChange={handleChange}>
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
                  <textarea
                    name="item_description"
                    value={formData.item_description}
                    onChange={handleChange}
                  />
                </label>

                {/* 🔘 Radio buttons */}
                <div>
                  <label>
                    <input
                      type="radio"
                      name="item_type"
                      value="lost"
                      checked={formData.item_type === "lost"}
                      onChange={handleChange}
                    />
                    Lost
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="item_type"
                      value="found"
                      checked={formData.item_type === "found"}
                      onChange={handleChange}
                    />
                    Found
                  </label>
                </div>

                <button type="submit">Log</button>
              </form>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

