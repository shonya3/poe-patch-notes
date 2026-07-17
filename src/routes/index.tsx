import { useState } from "react";
import { Await, createFileRoute, Link } from "@tanstack/react-router";
import styles from "./index.module.css";
import { FeaturedLink } from "~/components/featured-thread-link";
import { GroupFilter } from "~/components/GroupFilter";
import { LatestFeedItem } from "~/components/LatestFeedItem";
import { getLatestThreads, type FeedThread } from "~/server/functions";
import { FeedSkeleton } from "~/components/feed-skeleton";

export const Route = createFileRoute("/")({
  loader: async () => ({
    feedPromise: getLatestThreads(),
  }),
  component: Home,
});

const FORUM_GROUPS = [
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
  {
    label: "PoE2 Early Access",
    forums: [
      {
        name: "News",
        opts: [
          { id: "2211", lang: "en" },
          { id: "2271", lang: "ru" },
        ],
      },
      {
        name: "Patch Notes",
        opts: [
          { id: "2212", lang: "en" },
          { id: "2272", lang: "ru" },
        ],
      },
    ],
  },
] as const;

const FEATURED_LINKS = [
  {
    id: "3985332",
    label: "3.29 Patch Notes — EN",
    title: "Content Update 3.29.0 — Path of Exile: Curse of the Allflame",
  },
  {
    id: "3985346",
    label: "3.29 Patch Notes — RU",
    title: "Обновление 3.29.0 - Path of Exile: Проклятие Всепламени",
  },
] as const;

const FEED_GROUPS = ["PoE1", "PoE2"] as const;
const SHOW_N_LATEST = 5;

function Home() {
  const { feedPromise } = Route.useLoaderData();
  const [active, setActive] = useState<Set<string>>(() => new Set(FEED_GROUPS));
  const toggle = (g: string) => {
    const next = new Set(active);
    if (next.has(g)) next.delete(g);
    else next.add(g);
    setActive(next);
  };

  return (
    <div className="container">
      <section className={styles.section}>
        <h2 className={styles.forumsHeading}>Featured</h2>
        {FEATURED_LINKS.map(({ id, label, title }) => (
          <FeaturedLink key={id} id={id} label={label} title={title} />
        ))}
      </section>
      <section className={styles.section}>
        <h2 className={styles.forumsHeading}>Latest</h2>
        <GroupFilter groups={FEED_GROUPS} active={active} onToggle={toggle} />
        <Await promise={feedPromise} fallback={<FeedSkeleton items={SHOW_N_LATEST} />}>
          {(feed) => {
            const filtered = feed.filter((t) => active.has(t.groupLabel));
            const preview = filtered.slice(0, SHOW_N_LATEST);

            return (
              <>
                {filtered.length === 0 ? (
                  <p className={styles.empty}>No threads found in the last 30 days.</p>
                ) : (
                  <>
                    <ul className={styles.feed}>
                      {preview.map((t: FeedThread) => (
                        <LatestFeedItem key={`${t.lang}-${t.id}`} t={t} />
                      ))}
                    </ul>
                    <Link to="/latest" className={styles.viewAll}>
                      View all →
                    </Link>
                  </>
                )}
              </>
            );
          }}
        </Await>
      </section>
      <section className={styles.section}>
        <h2 className={styles.forumsHeading}>Forums</h2>
        {FORUM_GROUPS.map((group) => (
          <div key={group.label} className={styles.forumGroup}>
            <h3 className={styles.groupHeading}>{group.label}</h3>
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
      </section>
    </div>
  );
}
