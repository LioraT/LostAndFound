// components/features/AddItemFeature.jsx
import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import styles from "../../styles/theme.module.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { mapIcons } from "../../utils/mapIcons";

// const markerIcon = new L.Icon({ <==== moved to utils/mapIcons.js
//   iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

export default function AddItemFeature() {
  const [clickedPosition, setClickedPosition] = useState(null);
  const { token, user } = useAuth();

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
      console.log("Submitted:", res.data);
      alert("Item logged successfully.");
      setClickedPosition(null);
      setFormData({
        telephone: "",
        item_category: "keys",
        item_description: "",
        item_type: "lost",
        dateReported: new Date().toISOString().slice(0, 16),
        address: "",
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to submit item.");
    }
  };

  return (
    <>
      {clickedPosition && (
        <Marker position={[clickedPosition.lat, clickedPosition.lng]} icon={mapIcons.markerIcon}>
          <Popup>
            <form onSubmit={handleSubmit} className={styles.popupForm}>
              <p>
                <strong>Coordinates:</strong>
                <br />
                {clickedPosition.lat.toFixed(5)}, {clickedPosition.lng.toFixed(5)}
              </p>

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
    </>
  );
}
