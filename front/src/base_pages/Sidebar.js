//styledone

import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaUserCircle,
  FaKey,
  FaSearch,
  FaList,
  FaPlusCircle,
  FaMap,
  FaDotCircle
} from "react-icons/fa";
import styles from "../styles/theme.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaHome className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Home</span>
      </NavLink>

      <NavLink to="/items"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaList className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Items List</span>
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaInfoCircle className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>About</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaUserCircle className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Profile</span>
      </NavLink>

      <NavLink
        to="/change_password"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaKey className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Password</span>
      </NavLink>

      <NavLink
        to="/search_users"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaSearch className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Search Users</span>
      </NavLink>

      <NavLink
        to="/lostfound_report"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaPlusCircle className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Add item</span>
      </NavLink>

      
      <NavLink
        to="/map-tools"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaMap className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>Map Tools</span>
      </NavLink>


      <NavLink
        to="/search_neighb"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaMap className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>neighborhood</span>
      </NavLink>

     <NavLink
        to="/search_radius"
        className={({ isActive }) =>
          isActive ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink
        }
      >
        <FaDotCircle className={styles.sidebarIcon} />
        <span className={styles.sidebarLabel}>radius</span>
      </NavLink>
    </aside>
  );
}