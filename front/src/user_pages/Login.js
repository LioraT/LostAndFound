//styledone

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import styles from "../styles/theme.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signin } = useAuth(); // get signin function from context

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const result = await signin(username, password);
  
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }
  };


  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.loginInput}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.loginInput}
        />
        <div className={styles.loginButtonRow}>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className={`${styles.loginButton} ${styles.loginButtonSecondary}`}
          >
            Register
          </button>
        </div>
      </form>
      {error && <p className={styles.loginError}>{error}</p>}
    </div>
  );
}
