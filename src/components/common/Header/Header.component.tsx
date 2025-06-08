import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto px-2 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Catalyst Task
        </Link>
        <label className="flex items-center cursor-pointer gap-2">
          <div className="relative">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              className="sr-only"
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                isDarkMode ? "translate-x-4" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm text-gray-700 dark:text-white">Dark Mode</span>
        </label>
      </div>
    </header>
  );
};

export default Header;
