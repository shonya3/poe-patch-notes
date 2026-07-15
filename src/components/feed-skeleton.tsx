import styles from "./feed-skeleton.module.css";

export function FeedSkeleton({ items }: { items: number }) {
  return (
    <ul className={styles.skeleton}>
      {Array.from({ length: items }).map((_, i) => (
        <li key={i} className={styles.item}>
          <div className={styles.title} />
          <div className={styles.meta}>
            <div className={styles.badge} />
            <div className={styles.time} />
          </div>
        </li>
      ))}
    </ul>
  );
}
