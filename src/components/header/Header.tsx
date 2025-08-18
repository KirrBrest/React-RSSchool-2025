'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import './Header.css';

const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleHomeClick = () => {
    localStorage.removeItem('searchQuery');
    window.dispatchEvent(new CustomEvent('clearSearch'));
  };

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-logo">
          <span className="pokemon-icon">⚡</span>
          <h1>Pokemon Explorer</h1>
        </div>

        <nav className="header-nav">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <Link
            href="/about"
            className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
          >
            <span className="nav-icon">ℹ️</span>
            About
          </Link>
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
