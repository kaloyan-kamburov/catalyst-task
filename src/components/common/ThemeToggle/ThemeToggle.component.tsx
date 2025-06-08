import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="theme-toggle"
        checked={isDarkMode}
        onChange={toggleDarkMode}
        className="relative h-5 w-10 cursor-pointer appearance-none rounded-full bg-gray-300 transition-colors duration-200 ease-in-out 
          checked:bg-blue-500 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white 
          after:transition-transform after:duration-200 after:ease-in-out checked:after:translate-x-5
          dark:bg-gray-600 dark:checked:bg-blue-400"
      />
      <label
        htmlFor="theme-toggle"
        className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Dark Mode
      </label>
    </div>
  );
};

export default ThemeToggle;
