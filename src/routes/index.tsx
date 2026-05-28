import { createFileRoute, Link } from "@tanstack/react-router";
import { PATCH_NOTES_0_5_EN_THREAD_ID, PATCH_NOTES_0_5_RU_THREAD_ID } from "~/consts";
import styles from "./index.module.css";

export const Route = createFileRoute("/")({
  component: Home,
});

const subforums = [
  { id: "2212", name: "English Patch Notes" },
  { id: "2272", name: "Russian Patch Notes" },
];

function Home() {
  return (
    <div className="container">
      <div className={styles.featured}>
        <Link
          to="/thread/$threadId"
          params={{ threadId: PATCH_NOTES_0_5_EN_THREAD_ID }}
          className={styles.featuredLink}
        >
          <span className={styles.featuredLabel}>0.5.0 Patch Notes — EN</span>
          <span className={styles.featuredTitle}>
            Content Update 0.5.0 — Path of Exile 2: Return of the Ancients
          </span>
          <span className={styles.featuredArrow}>→</span>
        </Link>
        <Link
          to="/thread/$threadId"
          params={{ threadId: PATCH_NOTES_0_5_RU_THREAD_ID }}
          className={styles.featuredLink}
        >
          <span className={styles.featuredLabel}>0.5.0 Patch Notes — RU</span>
          <span className={styles.featuredTitle}>
            Обновление 0.5.0 — Path of Exile 2: Возвращение Древних
          </span>
          <span className={styles.featuredArrow}>→</span>
        </Link>
      </div>
      <h2 className={styles.forumsHeading}>Forums</h2>
      <div className={styles.forumCards}>
        {subforums.map((sf) => (
          <Link
            key={sf.id}
            to="/forum/$forumId"
            search={{ page: 1 }}
            params={{ forumId: sf.id }}
            className={styles.forumCard}
          >
            <span className={styles.forumCardTitle}>{sf.name}</span>
            <span className={styles.forumCardArrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
