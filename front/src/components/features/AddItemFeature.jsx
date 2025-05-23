// components/features/AddItemFeature.jsx

import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import styles from "../../styles/theme.module.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { mapIcons } from "../../utils/mapIcons";
import { useNavigate } from "react-router-dom";  // ✅ Added for redirect

export default function AddItemFeature() {
  const [clickedPosition, setClickedPosition] = useState(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();  // ✅ Initialize navigate

  const [formData, setFormData] = useState({
    telephone: "",
    item_category: "keys",
    item_description: "",
    item_type: "lost",
    dateReported: new Date().toISOString().slice(0, 16),
    address: "",
  });

  useMapEvents({
    click(e) {
      setClickedPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to submit.");
      return;
    }

    const data = {
      owner_name: user?.username || "guest",
      telephone: formData.telephone,
      item_type: {
        type: formData.item_type,
        dateReported: new Date(formData.dateReported),
      },
      resolved: false,
      title: `${formData.item_type} ${formData.item_category}`,
      item_category: formData.item_category,
      item_description: formData.item_description,
      address: formData.address || "Tel Aviv",
      location: {
        type: "Point",
        coordinates: [clickedPosition.lng, clickedPosition.lat],
      },
    };

    try {
      const res = await api.post("/items/", data);
      alert("Item logged successfully.");

      // ✅ Redirect to SearchByItem with new itemId
      const newItemId = res.data._id;
      navigate(`/map-tools?item=${newItemId}&zoom=true&preview=true`);
    } catch (err) {
      console.error("Error submitting item:", err);
      alert("Failed to submit item.");
    }

    setClickedPosition(null);
    setFormData({
      telephone: "",
      item_category: "keys",
      item_description: "",
      item_type: "lost",
      dateReported: new Date().toISOString().slice(0, 16),
      address: "",
    });
  };

  return (
    <>
      {clickedPosition && (
        <Marker position={[clickedPosition.lat, clickedPosition.lng]} icon={mapIcons.markerIcon}>
          <Popup>
            <form onSubmit={handleSubmit} className={styles.popupForm}>
              <p><strong>Coordinates:</strong><br />{clickedPosition.lat.toFixed(5)}, {clickedPosition.lng.toFixed(5)}</p>

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

              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </label>

              <div className="radioGroup">
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
              <button type="submit">Submit</button>
            </form>
          </Popup>
        </Marker>
      )}
    </>
  );
}
