//styledone

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/theme.module.css";
import api from '../api/axios';

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/protected/users/${id}`);
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load user.");
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "is_admin" && id === currentUser?._id) {
      return;
    }
    
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await api.delete(`/protected/users/${id}`);
      alert("User deleted successfully.");
      navigate("/search_users");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await api.put(`/protected/users/${id}`, user);
      setMessage("User updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
    }
  };

  if (error && !user) return <p className={styles.editUserError}>{error}</p>;
  if (!user) return <p>Loading...</p>;

  const isOwnProfile = id === currentUser?._id;

  return (
    <div className={styles.editUserContainer}>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className={styles.editUserForm}>
        <input
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="Username"
          disabled
          className={styles.editUserInput}
        />
        <input
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.editUserInput}
        />
        <input
          name="first_name"
          value={user.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className={styles.editUserInput}
        />
        <input
          name="family_name"
          value={user.family_name}
          onChange={handleChange}
          placeholder="Family Name"
          className={styles.editUserInput}
        />
        {!isOwnProfile && (
          <label>
            <input
              type="checkbox"
              name="is_admin"
              checked={user.is_admin}
              onChange={handleChange}
            />
            Admin
          </label>
        )}
        <button type="submit" className={styles.editUserButton}>Update User</button>
        {!isOwnProfile && (
          <button
            onClick={handleDelete}
            type="button"
            className={styles.editUserDeleteButton}
          >
            Delete User
          </button>
        )}
        {message && <p className={styles.editUserSuccess}>{message}</p>}
        {error && <p className={styles.editUserError}>{error}</p>}
      </form>
    </div>
  );
}

