import React from 'react';
const Loader = ({ message = "Loading..." }) => (
  <div className="loader-container">
    <div className="loader"></div>
    <p>{message}</p>
  </div>
);
export default Loader;
