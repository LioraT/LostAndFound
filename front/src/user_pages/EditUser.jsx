//styledone

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/theme.module.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate(`/login`);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/protected/users/${id}`, {
          headers: { Authorization: token },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Unauthorized or not found");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user.");
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    if (!token) {
      navigate(`/login`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/protected/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete user.");
        return;
      }

      alert("User deleted successfully.");
      navigate("/search_users");
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      navigate(`/login`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/protected/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed.");
        return;
      }

      setMessage("User updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Error while updating user.");
    }
  };

  if (error && !user) return <p className={styles.editUserError}>{error}</p>;
  if (!user) return <p>Loading...</p>;

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
        <label>
          <input
            type="checkbox"
            name="is_admin"
            checked={user.is_admin}
            onChange={handleChange}
          />
          Admin
        </label>
        <button type="submit" className={styles.editUserButton}>Update User</button>
        <button
          onClick={handleDelete}
          type="button"
          className={styles.editUserDeleteButton}
        >
          Delete User
        </button>
        {message && <p className={styles.editUserSuccess}>{message}</p>}
        {error && <p className={styles.editUserError}>{error}</p>}
      </form>
    </div>
  );
}

