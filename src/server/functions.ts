import { createServerFn } from "@tanstack/react-start";
import { cachedFetch } from "./fetch";
import { cleanThreadHtml, parseThreadList } from "./parser";

const FORUM_BASE = "https://www.pathofexile.com/forum";

export const getForumThreadsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => d as { forumId: string; page: string })
  .handler(async (ctx) => {
    const data = ctx.data;
    const url = `${FORUM_BASE}/view-forum/${data.forumId}?page=${data.page}`;
    const html = await cachedFetch(url, 1800);
    return { threads: parseThreadList(html), forumId: data.forumId, page: data.page };
  });

export const getThreadContentFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => d as { threadId: string })
  .handler(async (ctx) => {
    const data = ctx.data;
    const url = `${FORUM_BASE}/view-thread/${data.threadId}`;
    const html = await cachedFetch(url, 7200);
    const { html: content, toc } = cleanThreadHtml(html);
    return { content, toc, forumUrl: url };
  });
