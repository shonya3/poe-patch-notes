import { createFileRoute, Link } from "@tanstack/react-router";
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
    id: "3975218",
    label: "0.5.4 Patch Notes — EN",
    title: "0.5.4 Patch Notes",
  },
  {
    id: "3975239",
    label: "0.5.4 Patch Notes — RU",
    title: "Обновление 0.5.4",
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
