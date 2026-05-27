import { useLocation } from "@tanstack/react-router";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { href: "/thread/3932540", label: "0.5.0 EN" },
  { href: "/thread/3932617", label: "0.5.0 RU" },
] as const;

export function Nav() {
  const { pathname } = useLocation();
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <a href="/" className={styles.navBrand}>Patch Notes</a>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`${styles.navLink}${pathname === l.href ? ` ${styles.active}` : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button className={styles.themeToggle} id="theme-toggle"></button>
      </div>
    </nav>
  );
}
