import { Link } from "@tanstack/react-router";
import styles from "./featured-thread-link.module.css";

export type FeaturedLinkProps = {
  id: string;
  label: string;
  title: string;
};

export function FeaturedLink({ id, title, label }: FeaturedLinkProps) {
  return (
    <Link
      to="/thread/$threadId"
      params={{ threadId: id }}
      search={{ lang: "en" }}
      className={styles.featuredLink}
    >
      <span className={styles.featuredLabel}>{label}</span>
      <span className={styles.featuredTitle}>{title}</span>
      <span className={styles.featuredArrow}>→</span>
    </Link>
  );
}
