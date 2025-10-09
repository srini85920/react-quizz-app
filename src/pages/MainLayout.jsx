// src/pages/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';

import styles from './MainLayout.module.css'; // 2. Import the new CSS module

const MainLayout = () => {
  return (
    <>
      {/* 3. Apply the new CSS class to the header */}
      <header className={styles.header}>
        <h1>AI Quiz Dashboard</h1>
      </header>

      <NavBar />
      
      <main className={styles.mainContent}>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </>
  );
};

export default MainLayout;