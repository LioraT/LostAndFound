import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import styles from "../styles/theme.module.css";
import api from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(12);

  const navigate = useNavigate();
  const { signup } = useAuth(); // get signup from context

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signup({
      username,
      password,
      first_name: firstName,
      family_name: familyName,
      email,
      date_of_birth: dateOfBirth,
      preferences: { page_size: pageSize },
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} className={styles.registerForm}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.registerInput}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.registerInput}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={styles.registerInput}
          required
        />
        <input
          type="text"
          placeholder="Family Name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          className={styles.registerInput}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.registerInput}
          required
        />
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={styles.registerInput}
        />
        <input
          type="number"
          placeholder="Page Size"
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className={styles.registerInput}
          min={1}
        />
        <button type="submit" className={styles.registerButton}>Register</button>
      </form>
      {error && <p className={styles.registerError}>{error}</p>}
    </div>
  );
}
