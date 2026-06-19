import { createFileRoute, Link } from "@tanstack/react-router";
import { PATCH_NOTES_THREAD_IDS } from "~/consts";
import styles from "./index.module.css";
import { FeaturedLink } from "~/components/featured-thread-link";

export const Route = createFileRoute("/")({
  component: Home,
});

const subforums = [
  { id: "2212", name: "English Patch Notes" },
  { id: "2272", name: "Russian Patch Notes" },
];

const FEATURED_LINKS = [
  {
    id: PATCH_NOTES_THREAD_IDS["0.5.3_EN"],
    label: "0.5.3 Patch Notes — EN",
    title: "0.5.3 Patch Notes",
  },
] as const;

function Home() {
  return (
    <div className="container">
      {FEATURED_LINKS.map(({ id, label, title }) => (
        <FeaturedLink key={id} id={id} label={label} title={title} />
      ))}
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
