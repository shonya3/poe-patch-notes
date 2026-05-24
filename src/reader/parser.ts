import { parse } from "node-html-parser";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

export function cleanThreadHtml(raw: string): { html: string; toc: TocItem[] } {
  const root = parse(raw);
  const post = root.querySelector("tr.newsPost") ?? root.querySelector('tr.staff') ?? null;
  if (!post) return { html: "", toc: [] };

  post.querySelectorAll(".posted-by").forEach((el) => el.remove());

  const contentEl = post.querySelector(".content") || post.querySelector("td:last-child") || post;

  contentEl.querySelectorAll("style, script").forEach((el) => el.remove());

  const toc: TocItem[] = [];
  const tocIds = new Set<string>();

  contentEl.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const keep: string[] = [];

    if (/^h[1-4]$/.test(tag)) {
      const text = el.text.trim();
      if (!text) return;
      const id = slugify(text);
      if (id === "tableofcontents" || id === "содержание" || tocIds.has(id)) return;
      el.setAttribute("id", id);
      keep.push("id");
      tocIds.add(id);
      toc.push({ id, text, level: Number(tag[1]) });
    }

    if (el.tagName === "A") keep.push("href");
    if (el.tagName === "IMG") { keep.push("src"); keep.push("alt"); }

    for (const key of Object.keys(el.attributes)) {
      if (!keep.includes(key)) el.removeAttribute(key);
    }
  });

  contentEl.querySelectorAll("img").forEach((el) => {
    const src = el.getAttribute("src") || "";
    if (src === "https://web.poecdn.com/public/news/2026-05-22/RotAInfographic.png") {
      el.setAttribute("src", "/img/RotAInfographic.webp");
    }
  });

  const tocHeading = contentEl.querySelector("h3");
  const tocText = tocHeading && tocHeading.text.trim();
  if (tocHeading && (tocText === "Table of Contents" || tocText === "Содержание")) {
    let ul = tocHeading.nextElementSibling;
    while (ul && ul.tagName !== "UL") ul = ul.nextElementSibling;
    if (ul) {
      const tocLinks = ul.querySelectorAll("a[href^='#']");
      const contentHeadings = contentEl.querySelectorAll("h1[id],h2[id],h3[id],h4[id]");
      let headingIdx = 0;
      tocLinks.forEach((link) => {
        while (headingIdx < contentHeadings.length) {
          const h = contentHeadings[headingIdx++];
          if (h === tocHeading) continue;
          link.setAttribute("href", "#" + h.id);
          break;
        }
      });
      if (toc.some((t) => t.id === "updatestopatchnotes")) {
        const li = parse('<li><a href="#updatestopatchnotes">Updates to Patch Notes</a></li>').firstChild;
        if (li) ul.appendChild(li);
      }
    }
  }

  return { html: contentEl.innerHTML, toc };
}

export interface ThreadLink {
  id: string;
  title: string;
}

export function parseThreadList(html: string): ThreadLink[] {
  const root = parse(html);
  const threads: ThreadLink[] = [];
  const seen = new Set<string>();

  root.querySelectorAll("td.thread .title a[href*='view-thread']").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const match = href.match(/view-thread\/(\d+)/);
    if (!match) return;
    const id = match[1];
    if (seen.has(id)) return;
    seen.add(id);
    threads.push({ id, title: link.text.trim() });
  });

  return threads;
}
