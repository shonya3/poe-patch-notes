import { Link } from "@tanstack/react-router";
import styles from "./Nav.module.css";
import { ThemeToggle } from "~/features/theme/ThemeToggle";

interface NavLink {
  to: string;
  params: Record<string, string>;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  {
    to: "/thread/$threadId",
    params: { threadId: "3985332" },
    label: "3.29 EN",
  },
  {
    to: "/thread/$threadId",
    params: { threadId: "3985346" },
    label: "3.29 RU",
  },
];

export function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <a href="/" className={styles.navBrand}>
          Patch Notes
        </a>
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
        <ThemeToggle />
      </div>
    </nav>
  );
}
