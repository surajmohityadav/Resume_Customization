'use client';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <button onClick={toggleTheme} className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-border transition-colors">
      {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
    </button>
  );
}