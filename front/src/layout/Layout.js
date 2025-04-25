// src/layout/Layout.js
//Style done
import React from "react";
import { Outlet } from "react-router-dom";
import styles from "../styles/theme.module.css";
import Dashboard from "../base_pages/Dashboard";
import Sidebar from "../base_pages/Sidebar";


export default function Layout() {
  return (
    <div className={styles.layoutGrid}>
      <header className={styles.layoutHeader}>
        <Dashboard />
      </header>
      <aside className={styles.layoutMenu}>
        <Sidebar />
      </aside>
      <main className={styles.layoutMain}>
        <Outlet /> {/* Routed pages go here */}
      </main>
      <footer className={styles.layoutFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerQuote}>
            <h2>“Out of all the things I have lost, I miss my mind the most.”</h2>
            <h3>Mark Twain</h3>
          </div>
        </div>
      </footer>
    </div>
  );
}