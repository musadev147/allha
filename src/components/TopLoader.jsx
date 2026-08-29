import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/allah_dan.jpeg';

const TopLoader = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(true);
    
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 500); // 500ms loading overlay on page change

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999
    }}>
      <div className="smart-loader-container">
        <div className="ripple-circle"></div>
        <div className="ripple-circle delay"></div>
        <img src={logo} alt="Loading..." className="loader-logo" />
      </div>
      <style>
        {`
          .smart-loader-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
          }
          .loader-logo {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
            z-index: 10;
            box-shadow: 0 0 20px var(--primary);
            animation: pulse-logo 1.5s ease-in-out infinite alternate;
          }
          .ripple-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid var(--primary);
            animation: ripple 1.5s linear infinite;
          }
          .ripple-circle.delay {
            animation-delay: 0.75s;
          }
          
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes pulse-logo {
            0% { transform: scale(1); box-shadow: 0 0 10px var(--primary); }
            100% { transform: scale(1.1); box-shadow: 0 0 30px var(--primary), 0 0 10px var(--secondary); }
          }
        `}
      </style>
    </div>
  );
};

export default TopLoader;
