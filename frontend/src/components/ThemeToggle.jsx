import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-textSecondary/20 text-textPrimary transition-colors duration-300 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={18} className="text-current" />
      ) : (
        <Sun size={18} className="text-current" />
      )}
    </button>
  );
};

export default ThemeToggle;