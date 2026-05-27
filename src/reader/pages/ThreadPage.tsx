import type { TocItem } from "../parser";
import { TocSidebar } from "../components/TocSidebar";

export function ThreadPage({
  content,
  toc,
  forumUrl,
}: {
  content: string;
  toc: TocItem[];
  forumUrl: string;
}) {
  return (
    <>
      <div class="container thread-layout">
        <div class="thread-content">
          <a href={forumUrl} class="forum-link" target="_blank">
            View on forum →
          </a>
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
  if(!headings.length) return;
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
    </>
  );
}
