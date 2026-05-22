import type { ThreadLink, TocItem } from "./parser";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/thread/3932540", label: "0.5.0" },
];

function Nav({ path }: { path: string }) {
  return (
    <nav class="nav">
      <div class="nav-inner">
        <a href="/" class="nav-brand">Patch Notes</a>
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
        <button class="theme-toggle" id="theme-toggle"></button>
      </div>
    </nav>
  );
}

function Shell({
  title,
  cssUrl,
  path,
  siteUrl,
  description,
  image,
  children,
}: {
  title: string;
  cssUrl: string;
  path: string;
  siteUrl?: string;
  description?: string;
  image?: string;
  children: any;
}) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>{title}</title>
        <meta name="description" content={description || "Path of Exile patch notes reader"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description || "Path of Exile patch notes reader"} />
        <meta property="og:type" content="website" />
        {siteUrl && <meta property="og:url" content={siteUrl} />}
        {image && siteUrl && <meta property="og:image" content={new URL(image, siteUrl).toString()} />}
        <meta name="twitter:card" content="summary_large_image" />{/**/}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(!t)t="system";if(t==="system")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme",t)})()`,
          }}
        />
        <link rel="stylesheet" href={cssUrl} />
        {import.meta.env.DEV && <script type="module" src="/@vite/client" />}
      </head>
      <body>
        <Nav path={path} />
        <main class="main">{children}</main>
        <script
          dangerouslySetInnerHTML={{
            __html: `var b=document.getElementById("theme-toggle");var t=document.documentElement.getAttribute("data-theme");b.textContent=t==="dark"?"Dark":t==="light"?"Light":"System";b.addEventListener("click",function(){var t=document.documentElement.getAttribute("data-theme");if(!t||t==="system"){document.documentElement.setAttribute("data-theme","light");localStorage.setItem("theme","light");this.textContent="Light"}else if(t==="light"){document.documentElement.setAttribute("data-theme","dark");localStorage.setItem("theme","dark");this.textContent="Dark"}else{document.documentElement.removeAttribute("data-theme");localStorage.setItem("theme","system");this.textContent="System"}})`,
          }}
        />
      </body>
    </html>
  );
}

export function LandingPage({ cssUrl, siteUrl }: { cssUrl: string; siteUrl?: string }) {
  const subforums = [
    { id: "2212", name: "English Patch Notes" },
    { id: "2272", name: "Russian Patch Notes" },
  ];
  return (
    <Shell title="Patch Notes" cssUrl={cssUrl} path="/" siteUrl={siteUrl} description="Path of Exile patch notes">
      <div class="container">
        <div class="featured">
          <a href="/thread/3932540" class="featured-link">
            <span class="featured-label">0.5.0 Patch Notes</span>
            <span class="featured-title">Content Update 0.5.0 — Path of Exile 2: Return of the Ancients</span>
            <span class="featured-arrow">→</span>
          </a>
        </div>
        <h2 class="forums-heading">Forums</h2>
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
  siteUrl,
}: {
  id: string;
  threads: ThreadLink[];
  page: string;
  cssUrl: string;
  siteUrl?: string;
}) {
  const path = `/forum/${id}`;
  const label = id === "2212" ? "English Patch Notes" : id === "2272" ? "Russian Patch Notes" : `Forum ${id}`;
  return (
    <Shell title={`${label} — Patch Notes`} cssUrl={cssUrl} path={path} siteUrl={siteUrl} description={label}>
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
  forumUrl,
  siteUrl,
}: {
  content: string;
  toc: TocItem[];
  cssUrl: string;
  forumUrl: string;
  siteUrl?: string;
}) {
  return (
    <Shell title="Thread — Patch Notes" cssUrl={cssUrl} path="" siteUrl={siteUrl} image="/img/RotAInfographic.webp">
      <div class="container thread-layout">
        <div class="thread-content">
          <a href={forumUrl} class="forum-link" target="_blank">View on forum →</a>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
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
