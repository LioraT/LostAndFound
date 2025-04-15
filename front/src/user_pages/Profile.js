import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/theme.module.css";
import api from '../api/axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/protected/profile');
        setUser(data);
        setFormData({
          first_name: data.first_name || "",
          family_name: data.family_name || "",
          email: data.email || "",
          page_size: data.preferences?.page_size || 12,
          date_of_birth: data.date_of_birth ? data.date_of_birth.slice(0, 10) : "",
        });
      } catch (err) {
        console.error("Profile load error:", err);
        setError(err.response?.data?.error || err.message);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "page_size" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await api.put('/protected/users/me', {
        first_name: formData.first_name,
        family_name: formData.family_name,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        preferences: { page_size: formData.page_size },
      });

      setUser(data.user);
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || err.message);
    }
  };

  if (error && !user) return <p className={styles.profileError}>{error}</p>;
  if (!user || !formData) return <p>Loading profile...</p>;

  return (
    <div className={styles.profileContainer}>
      <h2>My Profile</h2>

      {editing ? (
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.profileField}>
            <strong>Username:</strong> {user.username}
          </div>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className={styles.profileInput}
          />
          <input
            type="text"
            name="family_name"
            value={formData.family_name}
            onChange={handleChange}
            placeholder="Family Name"
            className={styles.profileInput}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={styles.profileInput}
          />
          <input
            type="number"
            name="page_size"
            value={formData.page_size}
            onChange={handleChange}
            placeholder="Page Size"
            className={styles.profileInput}
            min={1}
          />
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={styles.profileInput}
          />
          <div className={styles.profileButtonRow}>
            <button type="submit" className={styles.profileButton}>Save</button>
            <button type="button" onClick={() => setEditing(false)} className={styles.profileButton}>Cancel</button>
          </div>
          {message && <p className={styles.profileSuccess}>{message}</p>}
          {error && <p className={styles.profileError}>{error}</p>}
        </form>
      ) : (
        <>
          <div className={styles.profileField}><strong>Username:</strong> {user.username}</div>
          <div className={styles.profileField}><strong>First Name:</strong> {user.first_name}</div>
          <div className={styles.profileField}><strong>Family Name:</strong> {user.family_name}</div>
          <div className={styles.profileField}><strong>Email:</strong> {user.email}</div>
          <div className={styles.profileField}>
            <strong>Date of Birth:</strong> {user.date_of_birth ? user.date_of_birth.slice(0, 10) : "N/A"}
          </div>
          <div className={styles.profileField}><strong>Admin:</strong> {user.is_admin ? "Yes" : "No"}</div>
          <div className={styles.profileField}>
            <strong>Page Size Preference:</strong> {user.preferences?.page_size ?? "Default (12)"}
          </div>
          <button onClick={() => setEditing(true)} className={styles.profileButton}>Edit Profile</button>
        </>
      )}
    </div>
  );
}


