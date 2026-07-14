import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "./latest.module.css";
import { GroupFilter } from "~/components/GroupFilter";
import { LatestFeedItem } from "~/components/LatestFeedItem";
import { getLatestThreads, type FeedThread } from "~/server/functions";

export const Route = createFileRoute("/latest")({
  loader: async () => getLatestThreads(),
  component: LatestPage,
  head: () => ({
    meta: [{ title: "Latest Threads — PoE Patch Notes" }],
  }),
});

const GROUPS = ["PoE1", "PoE2"] as const;

function LatestPage() {
  const feed = Route.useLoaderData();
  const [active, setActive] = useState<Set<string>>(() => new Set(GROUPS));
  const toggle = (g: string) => {
    const next = new Set(active);
    if (next.has(g)) next.delete(g); else next.add(g);
    setActive(next);
  };
  const filtered = feed.filter((t) => active.has(t.groupLabel));
  return (
    <div className="container">
      <Link to="/" className={styles.backLink}>
        ← Home
      </Link>
      <h1 className={styles.heading}>Latest Threads</h1>
      <GroupFilter groups={GROUPS} active={active} onToggle={toggle} />
      {filtered.length === 0 && <p className={styles.empty}>No threads found in the last 30 days.</p>}
      <ul className={styles.feed}>
        {filtered.map((t: FeedThread) => (
          <LatestFeedItem key={`${t.lang}-${t.id}`} t={t} />
        ))}
      </ul>
    </div>
  );
}
