import type { TocItem } from "~/server/parser";
import styles from "./TocSidebar.module.css";

export function TocSidebar({ items }: { items: TocItem[] }) {
  return (
    <aside className={styles.toc}>
      <div className={styles.tocInner}>
        <div className={styles.tocLabel}>On this page</div>
        <nav className={styles.tocLinks}>
          {items.map((item) => {
            const levelClass =
              item.level === 1 ? styles.tocH1 : item.level === 2 ? styles.tocH2 : styles.tocH3;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`${styles.tocLink} ${levelClass}`}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
