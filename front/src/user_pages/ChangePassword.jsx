//styledone

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/theme.module.css";
import api from "../services/axios"; //axios instance

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      await api.put('/protected/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.response?.data?.error || "Failed to change password.");
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit} className={styles.changePasswordForm}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={styles.changePasswordInput}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.changePasswordInput}
          required
        />
        <button type="submit" className={styles.changePasswordButton}>
          Update Password
        </button>
        {message && <p className={styles.changePasswordSuccess}>{message}</p>}
        {error && <p className={styles.changePasswordError}>{error}</p>}
      </form>
    </div>
  );
}
