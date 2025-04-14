//styledone
import styles from "../styles/theme.module.css";

export default function About() {
  return (
    <div className={styles.homeContainer}>
      <h1><span>© 2025 PonyKeg</span></h1>
      <video className={styles.homeVideo} autoPlay muted playsInline>
        <source src="pkf3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

     
  