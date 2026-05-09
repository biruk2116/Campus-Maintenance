import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-11 w-18 items-center rounded-full bg-surface/80 backdrop-blur-sm border border-textSecondary/30 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background hover:border-primary/40 group"
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span
        className={`${
          isDark ? 'translate-x-10' : 'translate-x-1'
        } inline-block h-7 w-7 transform rounded-full bg-gradient-to-r from-primary to-secondary shadow-md transition-all duration-500 flex items-center justify-center relative z-10`}
      >
        {/* Icon with glow */}
        <div className="relative">
          {isDark ? (
            <Moon size={16} className="text-white drop-shadow-sm" />
          ) : (
            <Sun size={16} className="text-white drop-shadow-sm" />
          )}
          {/* Subtle glow around icon */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-sm -z-10" />
        </div>
      </span>

      {/* Theme indicator dots */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isDark ? 'bg-textSecondary/30' : 'bg-yellow-400 shadow-sm'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isDark ? 'bg-blue-400 shadow-sm' : 'bg-textSecondary/30'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;