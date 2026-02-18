import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-24 right-8 z-[60] group"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDarkMode ? 'Enable light mode' : 'Enable dark mode'}
    >
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-slate-200 dark:border-slate-700">
        {isDarkMode ? (
          <Sun size={18} className="text-[#FACC15]" />
        ) : (
          <Moon size={18} className="text-slate-600" />
        )}
        <span className="hidden sm:inline font-black uppercase tracking-widest text-[10px]">
          {isDarkMode ? 'Light' : 'Dark'}
        </span>
      </div>
    </button>
  );
};

export default DarkModeToggle;
