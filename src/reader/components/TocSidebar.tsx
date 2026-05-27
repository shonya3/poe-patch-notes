import type { TocItem } from "../parser";

export function TocSidebar({ items }: { items: TocItem[] }) {
  return (
    <aside class="toc">
      <div class="toc-inner">
        <div class="toc-label">On this page</div>
        <nav class="toc-links">
          {items.map((item) => {
            const levelClass = item.level === 1 ? "toc-h1" : item.level === 2 ? "toc-h2" : "toc-h3";
            return (
              <a href={`#${item.id}`} class={`toc-link ${levelClass}`}>
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
