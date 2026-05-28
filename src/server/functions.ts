import { createServerFn } from "@tanstack/react-start";
import { cachedFetch } from "./fetch";
import { cleanThreadHtml, parseThreadList } from "./parser";
import { object, pipe, string, minLength, number, minValue } from "valibot";

const FORUM_BASE = "https://www.pathofexile.com/forum";

const ForumThreadsSchema = object({
  forumId: pipe(string(), minLength(1)),
  page: pipe(number(), minValue(1)),
});

export const getForumThreadsFn = createServerFn({ method: "GET" })
  .inputValidator(ForumThreadsSchema)
  .handler(async ({ data }) => {
    const url = `${FORUM_BASE}/view-forum/${data.forumId}?page=${data.page}`;
    const html = await cachedFetch(url, 1800);
    return { threads: parseThreadList(html), forumId: data.forumId, page: data.page };
  });

const ThreadContentSchema = object({
  threadId: pipe(string(), minLength(1)),
});

export const getThreadContentFn = createServerFn({ method: "GET" })
  .inputValidator(ThreadContentSchema)
  .handler(async ({ data }) => {
    const url = `${FORUM_BASE}/view-thread/${data.threadId}`;
    const html = await cachedFetch(url, 7200);
    const { html: content, toc } = cleanThreadHtml(html);
    return { content, toc, forumUrl: url };
  });
