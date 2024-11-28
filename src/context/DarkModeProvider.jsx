import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const htmlElement = document.documentElement; // Refers to the <html> element
    if (darkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [darkMode]);

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
