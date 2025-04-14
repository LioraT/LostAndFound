//styledone

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import styles from "../styles/theme.module.css";


const API_URL = process.env.REACT_APP_API_URL;

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
      navigate("/about");
    } else {
      setError(result.error || "Login failed");
    }
  };

/*
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", username);
          navigate("/about");
        } else {
          setError(data.error || "Login token failed");
        }
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };
*/
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
