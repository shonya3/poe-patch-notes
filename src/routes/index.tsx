import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "./index.module.css";
import { FeaturedLink } from "~/components/featured-thread-link";

export const Route = createFileRoute("/")({
  component: Home,
});

const forumGroups = [
  {
    label: "PoE2 Early Access",
    forums: [
      { id: "2212", name: "Patch Notes (EN)", lang: "en" as const },
      { id: "2272", name: "Списки изменений (RU)", lang: "ru" as const },
    ],
  },
  {
    label: "PoE1",
    forums: [
      { id: "patch-notes", name: "Patch Notes (EN)", lang: "en" as const },
      { id: "patch-notes", name: "Списки изменений (RU)", lang: "ru" as const },
      { id: "news", name: "News (EN)", lang: "en" as const },
      { id: "news", name: "Новости (RU)", lang: "ru" as const },
    ],
  },
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
      {forumGroups.map((group) => (
        <div key={group.label} className={styles.forumGroup}>
          <h2 className={styles.forumsHeading}>{group.label}</h2>
          <div className={styles.forumCards}>
            {group.forums.map((sf) => (
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
      ))}
    </div>
  );
}
