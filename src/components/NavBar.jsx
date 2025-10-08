import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css'; // We'll add a dedicated CSS file

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} end>Home</NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Dashboard</NavLink>
      <NavLink to="/quiz" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Quiz</NavLink>
    </nav>
  );
};
export default NavBar;