import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";
import { getRouteApi } from "@tanstack/react-router";

function nextTheme(currentTheme: "dark" | "light"): "dark" | "light" {
  return currentTheme === "dark" ? "light" : "dark";
}

const routeApi = getRouteApi("__root__");

export function ThemeToggle() {
  const { scheme } = routeApi.useRouteContext();
  const [colorScheme, setColorScheme] = useState(scheme);

  useEffect(() => {
    document.cookie = "color-scheme=" + colorScheme + ";path=/;max-age=31536000;samesite=lax";
    document.documentElement.className = "color-scheme--" + colorScheme;
  }, [colorScheme]);

  return (
    <button className={styles.themeToggle} onClick={() => setColorScheme(nextTheme(colorScheme))} type="button">
      {colorScheme}
    </button>
  );
}
