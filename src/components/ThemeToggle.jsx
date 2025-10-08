// src/components/ThemeToggle.jsx

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeToggle.module.css'; // We'll create this CSS file next

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={styles.toggleButton}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;