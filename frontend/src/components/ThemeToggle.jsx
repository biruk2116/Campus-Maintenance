import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-16 items-center rounded-full bg-surface border border-textSecondary/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label="Toggle theme"
    >
      <span
        className={`${
          isDark ? 'translate-x-9' : 'translate-x-1'
        } inline-block h-6 w-6 transform rounded-full bg-primary transition-transform duration-300 flex items-center justify-center`}
      >
        {isDark ? (
          <Moon size={14} className="text-white" />
        ) : (
          <Sun size={14} className="text-white" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;