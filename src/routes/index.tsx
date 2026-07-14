import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "./index.module.css";
import { FeaturedLink } from "~/components/featured-thread-link";

export const Route = createFileRoute("/")({
  component: Home,
});

const subforums = [
  { id: "2212", name: "Early Access Patch Notes (EN)", lang: "en" },
  { id: "2272", name: "Списки изменений в раннем доступе (RU)", lang: "ru" },
  { id: "patch-notes", name: "Patch Notes (PoE1)", lang: "en" },
  { id: "patch-notes", name: "Списки изменений (PoE1)", lang: "ru" },
  { id: "news", name: "News (PoE1)", lang: "en" },
  { id: "news", name: "Новости (PoE1)", lang: "ru" },
] as const;

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
            key={`${sf.lang}-${sf.id}`}
            to="/forum/$forumId"
            search={{ page: 1, lang: sf.lang }}
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
