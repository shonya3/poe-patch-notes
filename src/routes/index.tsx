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
    id: PATCH_NOTES_THREAD_IDS["0.5.1_EN"],
    label: "0.5.1 Patch Notes — EN",
    title: "0.5.1 Patch Notes",
  },
  {
    id: PATCH_NOTES_THREAD_IDS["0.5.1_RU"],
    label: "0.5.1 Patch Notes — RU",
    title: "Обновление 0.5.1",
  },
  {
    id: PATCH_NOTES_THREAD_IDS["0.5.0_EN"],
    label: "0.5.0 Patch Notes — EN",
    title: "Content Update 0.5.0 — Path of Exile 2: Return of the Ancients",
  },
  {
    id: PATCH_NOTES_THREAD_IDS["0.5.0_RU"],
    label: "0.5.0 Patch Notes — RU",
    title: "Обновление 0.5.0 — Path of Exile 2: Возвращение Древних",
  },
] as const;

function Home() {
  return (
    <div className="container">
      {FEATURED_LINKS.map(({ id, label, title }) => (
        <FeaturedLink id={id} label={label} title={title} />
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
