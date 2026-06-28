import { createServerFn } from "@tanstack/react-start";
import { cleanThreadHtml, extractForumName, parseThreadList, type TocItem, type ThreadLink } from "./parser";
import { object, pipe, string, minLength, number, minValue } from "valibot";

const FORUM_BASE = "https://www.pathofexile.com/forum";

async function fetchForumHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "PatchNotes/1.0" } });
  return res.text();
}

const ForumThreadsSchema = object({
  forumId: pipe(string(), minLength(1)),
  page: pipe(number(), minValue(1)),
});

const logUrl = (u: string) => u.replace(FORUM_BASE, "");

export const getForumThreadsFn = createServerFn({ method: "GET" })
  .inputValidator(ForumThreadsSchema)
  .handler(async ({ data }) => {
    const url = `${FORUM_BASE}/view-forum/${data.forumId}?page=${data.page}`;
    const cache = await caches.open("parsed-forum");

    const cached = await cache.match(url);
    if (cached) {
      const json: Record<string, unknown> = await cached.json();
      console.log(`[forum-cache] HIT ${logUrl(url)}`);
      return { threads: json.threads as ThreadLink[], forumName: (json.forumName as string) ?? null, forumId: data.forumId, page: data.page };
    }

    console.log(`[forum-cache] MISS ${logUrl(url)}`);
    const raw = await fetchForumHtml(url);
    const threads = parseThreadList(raw);
    const forumName = extractForumName(raw);
    const cachedRes = new Response(JSON.stringify({ threads, forumName }), {
      headers: { "Cache-Control": "public, s-maxage=10" },
    });
    await cache.put(url, cachedRes);
    console.log(`[forum-cache] STORE ${logUrl(url)}`);
    return { threads, forumName, forumId: data.forumId, page: data.page };
  });

const ThreadContentSchema = object({
  threadId: pipe(string(), minLength(1)),
});

export const getThreadContentFn = createServerFn({ method: "GET" })
  .inputValidator(ThreadContentSchema)
  .handler(async ({ data }) => {
    const url = `${FORUM_BASE}/view-thread/${data.threadId}`;
    const cache = await caches.open("parsed-thread");

    const cached = await cache.match(url);
    if (cached) {
      const json: Record<string, unknown> = await cached.json();
      console.log(`[thread-cache] HIT ${logUrl(url)} (${String(json.content).length} B)`);
      return { content: json.content as string, toc: json.toc as TocItem[], forumUrl: url, subforumId: (json.subforumId as string) ?? null, subforumName: (json.subforumName as string) ?? null };
    }

    console.log(`[thread-cache] MISS ${logUrl(url)}`);
    const raw = await fetchForumHtml(url);
    const { html: content, toc, subforumId, subforumName } = cleanThreadHtml(raw);
    const cachedRes = new Response(JSON.stringify({ content, toc, subforumId, subforumName }), {
      headers: { "Cache-Control": "public, s-maxage=7200" },
    });
    await cache.put(url, cachedRes);
    console.log(`[thread-cache] STORE ${logUrl(url)} (${content.length} B)`);
    return { content, toc, forumUrl: url, subforumId, subforumName };
  });
