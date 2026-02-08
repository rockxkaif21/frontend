import { useEffect, useState } from "react";

const THEME_KEY = "slooze-theme";

type Theme = "light" | "dark";

const setThemeClass = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const nextTheme = stored ?? "light";
    setTheme(nextTheme);
    setThemeClass(nextTheme);
  }, []);

  const handleToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
    setThemeClass(nextTheme);
  };

  return (
    <button type="button" onClick={handleToggle} className="button-secondary">
      {theme === "light" ? "Switch to Dark" : "Switch to Light"}
    </button>
  );
};
