import { useEffect } from "react";
import type { TocItem } from "~/server/parser";
import styles from "./TocSidebar.module.css";

export function TocSidebar({ items }: { items: TocItem[] }) {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]");
    const headings = document.querySelectorAll<HTMLElement>(
      ".thread-content h1, .thread-content h2, .thread-content h3, .thread-content h4",
    );
    if (!headings.length || !links.length) return;

    function updateActive() {
      const scrollY = window.scrollY;
      let current = "";
      if (scrollY > 1) {
        const isBottom = scrollY + window.innerHeight >= document.body.offsetHeight - 1;
        if (isBottom) {
          current = headings[headings.length - 1].id;
        } else {
          for (let i = 0; i < headings.length; i++) {
            if (headings[i].offsetTop - 80 <= scrollY) current = headings[i].id;
            else break;
          }
        }
      }
      for (let i = 0; i < links.length; i++) {
        links[i].classList.toggle("active", links[i].getAttribute("href") === "#" + current);
      }
    }

    function onScroll() { requestAnimationFrame(updateActive); }
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("[data-toc-link]");
      if (!link) return;
      const el = document.getElementById(link.getAttribute("href")!.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [items]);

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
                data-toc-link="true"
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
