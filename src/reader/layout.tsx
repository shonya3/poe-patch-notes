import type { ThreadLink, TocItem } from "./parser";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/forum/2212", label: "English Patch Notes" },
  { href: "/forum/2272", label: "Russian Patch Notes" },
];

function Nav({ path }: { path: string }) {
  return (
    <nav class="nav">
      <div class="nav-inner">
        <a href="/" class="nav-brand">PoE Forum Reader</a>
        <div class="nav-links">
          {NAV_LINKS.map((l) => (
            <a
              href={l.href}
              class={"nav-link" + (path === l.href ? " active" : "")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Shell({
  title,
  cssUrl,
  path,
  children,
}: {
  title: string;
  cssUrl: string;
  path: string;
  children: any;
}) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href={cssUrl} />
        <script type="module" src="/@vite/client" />
      </head>
      <body>
        <Nav path={path} />
        <main class="main">{children}</main>
      </body>
    </html>
  );
}

export function LandingPage({ cssUrl }: { cssUrl: string }) {
  const subforums = [
    { id: "2212", name: "English Patch Notes" },
    { id: "2272", name: "Russian Patch Notes" },
  ];
  return (
    <Shell title="PoE Forum Reader" cssUrl={cssUrl} path="/">
      <div class="container">
        <h1>Forums</h1>
        <div class="forum-cards">
          {subforums.map((sf) => (
            <a href={`/forum/${sf.id}`} class="forum-card">
              <span class="forum-card-title">{sf.name}</span>
              <span class="forum-card-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function ForumPage({
  id,
  threads,
  page,
  cssUrl,
}: {
  id: string;
  threads: ThreadLink[];
  page: string;
  cssUrl: string;
}) {
  const path = `/forum/${id}`;
  const label = id === "2212" ? "English Patch Notes" : id === "2272" ? "Russian Patch Notes" : `Forum ${id}`;
  return (
    <Shell title={`${label} — PoE Forum Reader`} cssUrl={cssUrl} path={path}>
      <div class="container">
        <h1>{label}</h1>
        {threads.length === 0 && <p>No threads found.</p>}
        <ul class="thread-list">
          {threads.map((t) => (
            <li>
              <a href={`/thread/${t.id}`}>{t.title}</a>
            </li>
          ))}
        </ul>
        <div class="pagination">
          {Number(page) > 1 && (
            <a href={`/forum/${id}?page=${Number(page) - 1}`}>← Previous</a>
          )}
          <a href={`/forum/${id}?page=${Number(page) + 1}`}>Next →</a>
        </div>
      </div>
    </Shell>
  );
}

export function TocSidebar({ items }: { items: TocItem[] }) {
  return (
    <aside class="toc">
      <div class="toc-inner">
        <div class="toc-label">On this page</div>
        <nav class="toc-links">
          {items.map((item) => (
            <a
              href={`#${item.id}`}
              class={"toc-link" + (item.level === 1 ? " toc-h1" : item.level === 2 ? " toc-h2" : " toc-h3")}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function ThreadPage({
  content,
  toc,
  cssUrl,
}: {
  content: string;
  toc: TocItem[];
  cssUrl: string;
}) {
  return (
    <Shell title="Thread — PoE Forum Reader" cssUrl={cssUrl} path="">
      <div class="container thread-layout">
        <div class="thread-content" dangerouslySetInnerHTML={{ __html: content }} />
        {toc.length > 0 && <TocSidebar items={toc} />}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
document.addEventListener("click", function(e) {
  var link = e.target.closest(".toc-link");
  if (!link) return;
  var el = document.getElementById(link.getAttribute("href").slice(1));
  if (el) el.scrollIntoView({ behavior: "smooth" });
});
var tocLinks = document.querySelectorAll(".toc-link");
var headings = document.querySelectorAll(".thread-content h1, .thread-content h2, .thread-content h3, .thread-content h4");
function updateActive() {
  var scrollY = window.scrollY;
  var current = "";
  if (scrollY > 1) {
    var isBottom = scrollY + window.innerHeight >= document.body.offsetHeight - 1;
    if (isBottom) {
      current = headings[headings.length - 1].id;
    } else {
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].offsetTop - 80 <= scrollY) current = headings[i].id;
        else break;
      }
    }
  }
  for (var i = 0; i < tocLinks.length; i++) {
    tocLinks[i].classList.toggle("active", tocLinks[i].getAttribute("href") === "#" + current);
  }
}
var ticking = false;
window.addEventListener("scroll", function() {
  if (!ticking) {
    requestAnimationFrame(function() { updateActive(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
updateActive();
`
            .trim()
            .replace(/\n\s+/g, "\n"),
        }}
      />
    </Shell>
  );
}
