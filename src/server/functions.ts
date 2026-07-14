import { createServerFn } from "@tanstack/react-start";
import {
  cleanThreadHtml,
  extractForumName,
  parseThreadList,
  type TocItem,
  type ThreadLink,
} from "./parser";
import { fallback, object, pipe, string, minLength, number, minValue, picklist } from "valibot";

const FORUM_BASES = {
  en: "https://www.pathofexile.com/forum",
  ru: "https://ru.pathofexile.com/forum",
} as const;
const stripHost = (u: string) => new URL(u).pathname;

async function fetchForumHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "PatchNotes/1.0" } });
  return res.text();
}

const ForumThreadsSchema = object({
  forumId: pipe(string(), minLength(1)),
  page: pipe(number(), minValue(1)),
  lang: fallback(picklist(["en", "ru"]), "en"),
});

export const getForumThreadsFn = createServerFn({ method: "GET" })
  .inputValidator(ForumThreadsSchema)
  .handler(async ({ data }) => {
    const base = FORUM_BASES[data.lang];
    const url = `${base}/view-forum/${data.forumId}?page=${data.page}`;
    const cache = await caches.open("parsed-forum");

    const cached = await cache.match(url);
    if (cached) {
      const json: Record<string, unknown> = await cached.json();
      console.log(`[forum-cache] HIT ${stripHost(url)}`);

      return {
        threads: json.threads as ThreadLink[],
        forumName: (json.forumName as string) ?? null,
        forumId: data.forumId,
        page: data.page,
        lang: data.lang,
      };
    }

    console.log(`[forum-cache] MISS ${stripHost(url)}`);
    const raw = await fetchForumHtml(url);
    const threads = parseThreadList(raw);
    const forumName = extractForumName(raw);
    const cachedRes = new Response(JSON.stringify({ threads, forumName }), {
      headers: { "Cache-Control": "public, s-maxage=10" },
    });
    await cache.put(url, cachedRes);
    console.log(`[forum-cache] STORE ${stripHost(url)}`);
    return { threads, forumName, forumId: data.forumId, page: data.page, lang: data.lang };
  });

const ThreadContentSchema = object({
  threadId: pipe(string(), minLength(1)),
});

export const getThreadContentFn = createServerFn({ method: "GET" })
  .inputValidator(ThreadContentSchema)
  .handler(async ({ data }) => {
    const url = `${FORUM_BASES.en}/view-thread/${data.threadId}`;
    const cache = await caches.open("parsed-thread");

    const cached = await cache.match(url);
    if (cached) {
      const json: Record<string, unknown> = await cached.json();
      console.log(`[thread-cache] HIT ${stripHost(url)} (${String(json.content).length} B)`);
      return {
        content: json.content as string,
        toc: json.toc as TocItem[],
        forumUrl: url,
        subforumId: (json.subforumId as string) ?? null,
        subforumName: (json.subforumName as string) ?? null,
      };
    }

    console.log(`[thread-cache] MISS ${stripHost(url)}`);
    const raw = await fetchForumHtml(url);
    const { html: content, toc, subforumId, subforumName } = cleanThreadHtml(raw);
    const cachedRes = new Response(JSON.stringify({ content, toc, subforumId, subforumName }), {
      headers: { "Cache-Control": "public, s-maxage=7200" },
    });
    await cache.put(url, cachedRes);
    console.log(`[thread-cache] STORE ${stripHost(url)} (${content.length} B)`);
    return { content, toc, forumUrl: url, subforumId, subforumName };
  });
