import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleHomeClick = () => {
    localStorage.removeItem('searchQuery');

    window.dispatchEvent(new CustomEvent('clearSearch'));

    navigate('/');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-logo">
          <span className="pokemon-icon">⚡</span>
          <h1>Pokemon Explorer</h1>
        </div>

        <nav className="header-nav">
          <button
            onClick={handleHomeClick}
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Home
          </button>
          <button
            onClick={handleAboutClick}
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            <span className="nav-icon">ℹ️</span>
            About
          </button>
          <button
            onClick={toggleTheme}
            className="nav-link theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <span className="nav-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Header;
