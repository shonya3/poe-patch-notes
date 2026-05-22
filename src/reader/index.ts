import { Hono } from "hono";
import { logger } from "hono/logger";
import cssUrl from "./style.css?url";
import { LandingPage, ForumPage, ThreadPage } from "./layout";
import { parseThreadList, cleanThreadHtml } from "./parser";
import { cachedFetch, cacheHeaders } from "./cache";

const FORUM_BASE = "https://www.pathofexile.com/forum";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.html(LandingPage({ cssUrl }));
});

app.get("/forum/:id", async (c) => {
  const id = c.req.param("id");
  const page = c.req.query("page") || "1";

  const url = `${FORUM_BASE}/view-forum/${id}?page=${page}`;
  const html = await cachedFetch(url, 1800);
  const threads = parseThreadList(html);

  return c.html(ForumPage({ id, threads, page, cssUrl }));
});

app.get("/thread/:id", async (c) => {
  const id = c.req.param("id");

  const url = `${FORUM_BASE}/view-thread/${id}`;
  const html = await cachedFetch(url, 7200);
  const { html: content, toc } = cleanThreadHtml(html);

  return c.html(ThreadPage({ content, toc, cssUrl, forumUrl: url }), 200, cacheHeaders());
});

export default app;
