import { Hono } from "hono";
import { logger } from "hono/logger";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { ForumPage } from "./pages/ForumPage";
import { ThreadPage } from "./pages/ThreadPage";
import { parseThreadList, cleanThreadHtml } from "./parser";
import { cachedFetch, cacheHeaders } from "./cache";

const FORUM_BASE = "https://www.pathofexile.com/forum";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.html(
    <Layout
      title="Patch Notes"
      path="/"
      siteUrl={c.req.url}
      description="Path of Exile patch notes"
    >
      <LandingPage />
    </Layout>,
  );
});

app.get("/forum/:id", async (c) => {
  const id = c.req.param("id");
  const page = c.req.query("page") || "1";

  const url = `${FORUM_BASE}/view-forum/${id}?page=${page}`;
  const html = await cachedFetch(url, 1800);
  const threads = parseThreadList(html);

  const label =
    id === "2212" ? "English Patch Notes" : id === "2272" ? "Russian Patch Notes" : `Forum ${id}`;
  return c.html(
    <Layout title={`${label} — Patch Notes`} siteUrl={c.req.url} description={label}>
      <ForumPage id={id} threads={threads} page={page} />
    </Layout>,
  );
});

app.get("/thread/:id", async (c) => {
  const id = c.req.param("id");

  const url = `${FORUM_BASE}/view-thread/${id}`;
  const html = await cachedFetch(url, 7200);
  const { html: content, toc } = cleanThreadHtml(html);

  return c.html(
    <Layout title="Thread — Patch Notes" siteUrl={c.req.url} image="/img/RotAInfographic.webp">
      <ThreadPage content={content} toc={toc} forumUrl={url} />
    </Layout>,
    200,
    cacheHeaders(),
  );
});

export default app;
