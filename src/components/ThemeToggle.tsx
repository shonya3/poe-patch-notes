import { useState } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "system";
    return document.documentElement.getAttribute("data-scheme") || "system";
  });

  const label = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  const toggle = () => {
    const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    if (next === "system") {
      document.documentElement.removeAttribute("data-scheme");
    } else {
      document.documentElement.setAttribute("data-scheme", next);
    }
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button className={styles.themeToggle} onClick={toggle} type="button">
      {label}
    </button>
  );
}
