"use client";

import { useTheme } from "@/context/themeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted on client side
  if (!mounted) {
    return (
      <button className="relative p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 w-9 h-9">
        <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-300 border border-secondary-200 dark:border-secondary-600"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-slate-400 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
