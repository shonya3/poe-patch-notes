export const COLOR_SCHEME_KEY = "color-scheme";

export const COLOR_SCHEME_VARIANTS = ["dark", "light"] as const;

export const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem("${COLOR_SCHEME_KEY}");
      const resolved = theme === "dark" || theme === "light"
        ? theme
        : matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      document.documentElement.className = "${COLOR_SCHEME_KEY}--" + resolved;
    } catch (e) { console.error(e); }
  })()
`;
