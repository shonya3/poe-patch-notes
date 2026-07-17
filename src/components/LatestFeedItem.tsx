import { Link } from "@tanstack/react-router";
import type { FeedThread } from "~/server/functions";
import { timeAgo } from "~/server/parser";
import styles from "./LatestFeedItem.module.css";

export function LatestFeedItem({ t }: { t: FeedThread }) {
  return (
    <li className={styles.item}>
      <Link to="/thread/$threadId" params={{ threadId: t.id }} search={{ lang: t.lang }}>
        <span className={styles.title}>{t.title}</span>
        <span className={styles.meta}>
          <span className={styles.badge}>
            {t.groupLabel} · {t.forumLabel} · {t.lang.toUpperCase()}
          </span>
          <span className={styles.time}>{timeAgo(t.createdAt)}</span>
        </span>
      </Link>
    </li>
  );
}
