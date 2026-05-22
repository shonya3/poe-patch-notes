import { parse } from "node-html-parser";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cleanThreadHtml(raw: string): { html: string; toc: TocItem[] } {
  const root = parse(raw);
  const post = root.querySelector("tr.newsPost");
  if (!post) return { html: "", toc: [] };

  post.querySelectorAll(".posted-by").forEach((el) => el.remove());

  const contentEl = post.querySelector(".content") || post.querySelector("td:last-child") || post;

  contentEl.querySelectorAll("style, script").forEach((el) => el.remove());

  const toc: TocItem[] = [];

  contentEl.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const keep: string[] = [];

    if (/^h[1-4]$/.test(tag)) {
      const text = el.text.trim();
      if (!text) return;
      const id = slugify(text);
      el.setAttribute("id", id);
      keep.push("id");
      toc.push({ id, text, level: Number(tag[1]) });
    }

    if (el.tagName === "A") keep.push("href");
    if (el.tagName === "IMG") { keep.push("src"); keep.push("alt"); }

    for (const key of Object.keys(el.attributes)) {
      if (!keep.includes(key)) el.removeAttribute(key);
    }
  });

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
