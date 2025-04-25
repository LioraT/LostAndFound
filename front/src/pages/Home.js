//styledone

import styles from "../styles/theme.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* <h1>Lost & Found App Introduction</h1> */}
      <video className={styles.homeVideo} autoPlay muted playsInline>
        <source src="pkf1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

  