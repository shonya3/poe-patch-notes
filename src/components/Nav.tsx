import { Link } from "@tanstack/react-router";
import styles from "./Nav.module.css";
import { ThemeToggle } from "~/features/theme/ThemeToggle";
import { PATCH_NOTES_THREAD_IDS } from "~/consts";

interface NavLink {
  to: string;
  params: Record<string, string>;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  {
    to: "/thread/$threadId",
    params: { threadId: PATCH_NOTES_THREAD_IDS["0.5.0_EN"] },
    label: "0.5 EN",
  },
  {
    to: "/thread/$threadId",
    params: { threadId: PATCH_NOTES_THREAD_IDS["0.5.0_RU"] },
    label: "0.5 RU",
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
