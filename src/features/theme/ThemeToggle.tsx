import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";
import { COLOR_SCHEME_KEY } from "~/features/theme";

function nextTheme(currentTheme: "dark" | "light"): "dark" | "light" {
  return currentTheme === "dark" ? "light" : "dark";
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setMounted(true);
    const actual = document.documentElement.className.includes("color-scheme--light")
      ? "light"
      : "dark";
    setColorScheme(actual);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);
    document.documentElement.className = "color-scheme--" + colorScheme;
  }, [colorScheme, mounted]);

  if (!mounted) return null;

  return (
    <button
      className={styles.themeToggle}
      onClick={() => setColorScheme(nextTheme(colorScheme))}
      type="button"
    >
      {colorScheme}
    </button>
  );
}
