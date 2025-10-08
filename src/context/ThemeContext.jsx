// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const ThemeContext = createContext();

// Create a custom hook to easily use the context
export const useTheme = () => useContext(ThemeContext);

// Create the Provider component
export const ThemeProvider = ({ children }) => {
  // 1. State to hold the current theme. Read from localStorage or default to 'light'.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // 2. Effect to apply the theme to the body and save to localStorage
  useEffect(() => {
    // Add the data-theme attribute to the body
    document.body.setAttribute('data-theme', theme);
    // Save the user's preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Function to toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};