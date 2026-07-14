import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "./latest.module.css";
import { LatestFeedItem } from "~/components/LatestFeedItem";
import { getLatestThreads, type FeedThread } from "~/server/functions";

export const Route = createFileRoute("/latest")({
  loader: async () => getLatestThreads(),
  component: LatestPage,
  head: () => ({
    meta: [{ title: "Latest Threads — PoE Patch Notes" }],
  }),
});

function LatestPage() {
  const feed = Route.useLoaderData();
  return (
    <div className="container">
      <Link to="/" className={styles.backLink}>
        ← Home
      </Link>
      <h1 className={styles.heading}>Latest Threads</h1>
      {feed.length === 0 && <p className={styles.empty}>No threads found in the last 30 days.</p>}
      <ul className={styles.feed}>
        {feed.map((t: FeedThread) => (
          <LatestFeedItem key={`${t.lang}-${t.id}`} t={t} />
        ))}
      </ul>
    </div>
  );
}
