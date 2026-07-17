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

async function fetchForumThreads(
  forumId: string,
  lang: "en" | "ru",
  page: number,
): Promise<{ threads: ThreadLink[]; forumName: string | null }> {
  const base = FORUM_BASES[lang];
  const url = `${base}/view-forum/${forumId}?page=${page}`;
  const cache = await caches.open("parsed-forum");

  const cached = await cache.match(url);
  if (cached) {
    const json: Record<string, unknown> = await cached.json();
    console.log(`[forum-cache] HIT ${stripHost(url)}`);
    return {
      threads: json.threads as ThreadLink[],
      forumName: (json.forumName as string) ?? null,
    };
  }

  console.log(`[forum-cache] MISS ${stripHost(url)}`);
  const raw = await fetchForumHtml(url);
  const threads = parseThreadList(raw, lang);
  const forumName = extractForumName(raw);
  const cachedRes = new Response(JSON.stringify({ threads, forumName }), {
    headers: { "Cache-Control": "public, s-maxage=10" },
  });
  await cache.put(url, cachedRes);
  console.log(`[forum-cache] STORE ${stripHost(url)}`);
  return { threads, forumName };
}

const ForumThreadsSchema = object({
  forumId: pipe(string(), minLength(1)),
  page: pipe(number(), minValue(1)),
  lang: fallback(picklist(["en", "ru"]), "en"),
});

export const getForumThreadsFn = createServerFn({ method: "GET" })
  .inputValidator(ForumThreadsSchema)
  .handler(async ({ data }) => {
    const { threads, forumName } = await fetchForumThreads(data.forumId, data.lang, data.page);
    return { threads, forumName, forumId: data.forumId, page: data.page, lang: data.lang };
  });

export type FeedThread = {
  id: string;
  title: string;
  createdAt: string;
  forumLabel: string;
  groupLabel: string;
  lang: "en" | "ru";
  forumId: string;
};

const LATEST_SOURCES = [
  { forumId: "2212", lang: "en", groupLabel: "PoE2", forumLabel: "Patch Notes" },
  { forumId: "2272", lang: "ru", groupLabel: "PoE2", forumLabel: "Списки изменений" },
  { forumId: "2211", lang: "en", groupLabel: "PoE2", forumLabel: "News" },
  { forumId: "2271", lang: "ru", groupLabel: "PoE2", forumLabel: "Новости" },
  { forumId: "patch-notes", lang: "en", groupLabel: "PoE1", forumLabel: "Patch Notes" },
  { forumId: "patch-notes", lang: "ru", groupLabel: "PoE1", forumLabel: "Списки изменений" },
  { forumId: "news", lang: "en", groupLabel: "PoE1", forumLabel: "News" },
  { forumId: "news", lang: "ru", groupLabel: "PoE1", forumLabel: "Новости" },
] as const;

export const getLatestThreads = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.allSettled(
    LATEST_SOURCES.map((s) => fetchForumThreads(s.forumId, s.lang, 1)),
  );

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const feed: FeedThread[] = [];

  for (let i = 0; i < LATEST_SOURCES.length; i++) {
    const res = results[i];
    if (res.status === "rejected") {
      console.error(
        `[latest-feed] FAIL ${LATEST_SOURCES[i].groupLabel} ${LATEST_SOURCES[i].forumId} ${LATEST_SOURCES[i].lang}`,
        res.reason,
      );
      continue;
    }
    for (const t of res.value.threads) {
      const ms = new Date(t.createdAt).getTime();
      if (!t.createdAt || isNaN(ms) || ms < cutoff) continue;
      feed.push({
        id: t.id,
        title: t.title,
        createdAt: t.createdAt,
        forumId: LATEST_SOURCES[i].forumId,
        lang: LATEST_SOURCES[i].lang,
        groupLabel: LATEST_SOURCES[i].groupLabel,
        forumLabel: LATEST_SOURCES[i].forumLabel,
      });
    }
  }

  feed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return feed;
});

const ThreadContentSchema = object({
  threadId: pipe(string(), minLength(1)),
});

export const getThreadContentFn = createServerFn({ method: "GET" })
  .inputValidator(ThreadContentSchema)
  .handler(async ({ data }) => {
    const url = `${FORUM_BASES.en}/view-thread/${data.threadId}`;
    const cache = await caches.open("parsed-thread-v2");

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
        title: (json.title as string) ?? null,
      };
    }

    console.log(`[thread-cache] MISS ${stripHost(url)}`);
    const raw = await fetchForumHtml(url);
    const { html: content, toc, subforumId, subforumName, title } = cleanThreadHtml(raw);
    const cachedRes = new Response(JSON.stringify({ content, toc, subforumId, subforumName, title }), {
      headers: { "Cache-Control": "public, s-maxage=7200" },
    });
    await cache.put(url, cachedRes);
    console.log(`[thread-cache] STORE ${stripHost(url)} (${content.length} B)`);
    return { content, toc, forumUrl: url, subforumId, subforumName, title };
  });
