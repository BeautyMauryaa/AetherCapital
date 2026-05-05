import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage, otherwise default to 'dark'
    return localStorage.getItem("aether-theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Remove both classes first to prevent "class stacking"
    root.classList.remove("light", "dark");

    // 2. Add the current theme class
    root.classList.add(theme);

    // 3. Set the data-attribute (useful for CSS selectors like [data-theme='dark'])
    root.setAttribute("data-theme", theme);

    // 4. Persist to localStorage
    localStorage.setItem("aether-theme", theme);

    // Update the --bg-main and --text-main variables
    if (theme === "dark") {
      root.style.setProperty("--bg-main", "#08080C");
      root.style.setProperty("--text-main", "#FFFFFF");
    } else {
      root.style.setProperty("--bg-main", "#FFFFFF");
      root.style.setProperty("--text-main", "#0F172A");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

export default ThemeProvider;