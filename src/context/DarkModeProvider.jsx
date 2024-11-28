import { createContext, useContext, useState } from "react";

const DarkModeContext = createContext();

const getSystemDarkModePreference = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const localTheme = localStorage.getItem("darkMode");

    if (localTheme === null) {
      const darkMode = getSystemDarkModePreference();
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      return darkMode;
    }

    return JSON.parse(localTheme);
  });

  const toggle = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => useContext(DarkModeContext);
