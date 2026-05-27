import { Link } from "@tanstack/react-router";
import styles from "./Nav.module.css";

interface NavLink {
  to: string;
  params: Record<string, string>;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { to: "/thread/$threadId", params: { threadId: "3932540" }, label: "0.5.0 EN" },
  { to: "/thread/$threadId", params: { threadId: "3932617" }, label: "0.5.0 RU" },
];

export function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <a href="/" className={styles.navBrand}>Patch Notes</a>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to + l.params.threadId}
              to={l.to}
              params={l.params}
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.active}` }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button className={styles.themeToggle} id="theme-toggle" />
      </div>
    </nav>
  );
}
