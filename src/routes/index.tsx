import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "./index.module.css";
import { FeaturedLink } from "~/components/featured-thread-link";
import { LatestFeedItem } from "~/components/LatestFeedItem";
import { getLatestThreads, type FeedThread } from "~/server/functions";

export const Route = createFileRoute("/")({
  loader: async () => getLatestThreads(),
  component: Home,
});

const forumGroups = [
  {
    label: "PoE2 Early Access",
    forums: [
      {
        name: "Patch Notes",
        opts: [
          { id: "2212", lang: "en" },
          { id: "2272", lang: "ru" },
        ],
      },
    ],
  },
  {
    label: "PoE1",
    forums: [
      {
        name: "News",
        opts: [
          { id: "news", lang: "en" },
          { id: "news", lang: "ru" },
        ],
      },
      {
        name: "Patch Notes",
        opts: [
          { id: "patch-notes", lang: "en" },
          { id: "patch-notes", lang: "ru" },
        ],
      },
    ],
  },
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
  const feed = Route.useLoaderData();
  const preview = feed.slice(0, 5);
  return (
    <div className="container">
      {FEATURED_LINKS.map(({ id, label, title }) => (
        <FeaturedLink key={id} id={id} label={label} title={title} />
      ))}
      {preview.length > 0 && (
        <section className={styles.feedSection}>
          <h2 className={styles.forumsHeading}>Latest</h2>
          <ul className={styles.feed}>
            {preview.map((t: FeedThread) => (
              <LatestFeedItem key={`${t.lang}-${t.id}`} t={t} />
            ))}
          </ul>
          <Link to="/latest" className={styles.viewAll}>View all →</Link>
        </section>
      )}
      {forumGroups.map((group) => (
        <div key={group.label} className={styles.forumGroup}>
          <h2 className={styles.forumsHeading}>{group.label}</h2>
          <div className={styles.forumCards}>
            {group.forums.map((forum) => (
              <div key={forum.name} className={styles.formCard}>
                <span className={styles.formName}>{forum.name}</span>
                <div className={styles.formLangs}>
                  <Link
                    to="/forum/$forumId"
                    search={{ page: 1, lang: "en" }}
                    params={{ forumId: forum.opts.find((o) => o.lang === "en")!.id }}
                    className={styles.formLangLink}
                  >
                    <span className={styles.formLangText}>EN</span>
                  </Link>
                  <Link
                    to="/forum/$forumId"
                    search={{ page: 1, lang: "ru" }}
                    params={{ forumId: forum.opts.find((o) => o.lang === "ru")!.id }}
                    className={styles.formLangLink}
                  >
                    <span className={styles.formLangText}>RU</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
