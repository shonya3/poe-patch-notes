import { parse } from "node-html-parser";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

export function cleanThreadHtml(raw: string): {
  html: string;
  toc: TocItem[];
  subforumId: string | null;
  subforumName: string | null;
} {
  const root = parse(raw);
  const post = root.querySelector("tr.newsPost") ?? root.querySelector("tr.staff") ?? null;
  if (!post) return { html: "", toc: [], subforumId: null, subforumName: null };

  const breadcrumbLink = root.querySelector('div.breadcrumb a[href*="view-forum"]');
  const subforumId =
    breadcrumbLink?.getAttribute("href")?.match(/view-forum\/([^/?#]+)/)?.[1] ?? null;
  const subforumName = breadcrumbLink?.text?.trim() ?? null;

  post.querySelectorAll(".posted-by").forEach((el) => el.remove());

  const contentEl = post.querySelector(".content") || post.querySelector("td:last-child") || post;

  contentEl.querySelectorAll("style, script").forEach((el) => el.remove());

  const toc: TocItem[] = [];
  const tocIds = new Set<string>();

  contentEl.querySelectorAll("h1,h2,h3,h4,a,img,strong").forEach((el) => {
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

    if (tag === "strong") {
      const text = el.text.trim();
      if (!text) return;
      const p = el.parentNode;
      if (!p) return;
      const isHeading =
        (p.tagName === "P" && p.textContent.trim() === text) ||
        (p.getAttribute("class") ?? "").includes("content");
      if (!isHeading) return;
      const id = slugify(text);
      if (id === "tableofcontents" || id === "содержание" || tocIds.has(id)) return;
      el.setAttribute("id", id);
      keep.push("id");
      tocIds.add(id);
      toc.push({ id, text, level: 3 });
    }

    if (el.tagName === "A") keep.push("href");
    if (el.tagName === "IMG") {
      keep.push("src");
      keep.push("alt");
      if (
        el.getAttribute("src") ===
        "https://web.poecdn.com/public/news/2026-05-22/RotAInfographic.png"
      ) {
        el.setAttribute("src", "/img/RotAInfographic.webp");
      }
    }

    for (const key of Object.keys(el.attributes)) {
      if (!keep.includes(key)) el.removeAttribute(key);
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
        const li = parse(
          '<li><a href="#updatestopatchnotes">Updates to Patch Notes</a></li>',
        ).firstChild;
        if (li) ul.appendChild(li);
      }
    }
  }

  // Remove empty <li>
  contentEl.querySelectorAll("li").forEach((li) => {
    const text = li.text.trim();
    const hasMeaningfulChild = li.querySelector("img, a[href]:not([href='#'])");
    if (!text && !hasMeaningfulChild) li.remove();
  });

  return { html: contentEl.innerHTML, toc, subforumId, subforumName };
}

export interface ThreadLink {
  id: string;
  title: string;
  createdAt: string;
  author: string | null;
}

export function extractForumName(html: string): string | null {
  const root = parse(html);
  const breadcrumb = root.querySelector("div.breadcrumb");
  if (!breadcrumb) return null;
  const span = breadcrumb.querySelector("span.separator");
  if (!span) {
    const txt = breadcrumb.text.trim();
    return txt || null;
  }
  const idx = breadcrumb.innerHTML.indexOf("</span>");
  if (idx === -1) return null;
  const after = breadcrumb.innerHTML.slice(idx + "</span>".length).trim();
  const name = after.replace(/<[^>]+>/g, "").trim();
  return name || null;
}

export function parseThreadList(html: string, lang: Lang = "en"): ThreadLink[] {
  const root = parse(html);
  const seen = new Set<string>();

  return Array.from(root.querySelectorAll("td.thread"))
    .map((row): ThreadLink | null => {
      const link = row.querySelector(".title a[href*='view-thread']");
      if (!link) return null;
      const href = link.getAttribute("href") || "";
      const match = href.match(/view-thread\/(\d+)/);
      if (!match) return null;
      const id = match[1];
      if (seen.has(id)) return null;
      seen.add(id);

      const dateEl = row.querySelector(".postBy .post_date");
      const dateStr = dateEl ? dateEl.text.trim().replace(/^,\s*/, "") : "";
      const createdAt = dateStr ? parseForumDate(lang, dateStr) : "";
      const authorEl = row.querySelector(".post_by_account a");
      const author = authorEl ? authorEl.text.trim() : null;

      return { id, title: link.text.trim(), createdAt, author };
    })
    .filter((t): t is ThreadLink => t !== null);
}

const EN_MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const RU_MONTHS = [
  "янв.",
  "февр.",
  "мар.",
  "апр.",
  "мая",
  "июн.",
  "июл.",
  "авг.",
  "сент.",
  "окт.",
  "нояб.",
  "дек.",
];

export type Lang = "en" | "ru";

// Converts an ISO date string to a relative time label like "3h ago" or "2d ago".
// Runs server-side during SSR; uses the worker's Date.now() so clock skew may
// cause slight inaccuracy vs the user's local time (negligible in production).
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "";
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function parseForumDate(lang: Lang, str: string): string {
  let s = str;

  if (lang === "ru") {
    for (let i = 0; i < RU_MONTHS.length; i++) {
      s = s.replace(RU_MONTHS[i], String(i + 1));
    }
    s = s.replace(" г.", "");
  }

  if (s.startsWith(", ")) {
    s = s.slice(2);
  }

  if (lang === "en") {
    const m = s.match(/^(\w+)\s+(\d+),\s+(\d+),\s+(\d+):(\d+):(\d+)\s+(AM|PM)$/);
    if (!m) return "";
    const month = EN_MONTHS.indexOf(m[1].toLowerCase().slice(0, 3));
    if (month === -1) return "";
    let h = Number(m[4]);
    if (m[7] === "PM" && h < 12) h += 12;
    if (m[7] === "AM" && h === 12) h = 0;
    return new Date(
      Date.UTC(Number(m[3]), month, Number(m[2]), h, Number(m[5]), Number(m[6])),
    ).toISOString();
  }

  const m = s.match(/^(\d+)\s+(\d+)\s+(\d+),\s+(\d+):(\d+):(\d+)$/);
  if (!m) return "";
  return new Date(
    Date.UTC(
      Number(m[3]),
      Number(m[2]) - 1,
      Number(m[1]),
      Number(m[4]),
      Number(m[5]),
      Number(m[6]),
    ),
  ).toISOString();
}
