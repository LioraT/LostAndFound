//styledone

import { useNavigate } from "react-router-dom";
import styles from "../styles/theme.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for doesn't exist.</p>
      <button onClick={() => navigate("/")} className={styles.notFoundButton}>
        Go Home
      </button>
    </div>
  );
}
