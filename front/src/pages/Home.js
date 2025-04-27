//styledone

import styles from "../styles/theme.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.homeHeading}>
        Lost It?<br />
        Found It? <br />
        Let’s Reconnect.
      </h2>
      <img src="/logo3 (1).png" alt="Company Logo" className={styles.footerLogo} />
    </div>
  );
}

  
