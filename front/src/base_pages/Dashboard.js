//styledone

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import styles from "../styles/theme.module.css";


export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signout } = useAuth(); // ✅ Use context instead of localStorage

  const handleLogout = () => {
    signout(); // Clears token and user state
    navigate("/login"); // Redirect to login
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardWelcome}>
        Welcome, {user?.username || "Guest"}
      </h2>
      {user?.username ? (
      <button onClick={handleLogout} className={styles.dashboardButton}>
        Logout
      </button>
    ) : (
      <Link to="/login" className={styles.dashboardLink}>please login</Link>
    )}
  </div>
  
  );
}

