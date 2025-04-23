import React from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <div className="theme-toggle">
      <button 
        className={`theme-toggle-button ${isDarkMode ? 'dark' : 'light'}`}
        onClick={onToggle}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default ThemeToggle;