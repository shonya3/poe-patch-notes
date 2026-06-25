import { parseThreadList, type ThreadLink } from "../server/parser";

const FORUM_BASE: Record<string, string> = {
  en: "https://www.pathofexile.com/forum",
  ru: "https://ru.pathofexile.com/forum",
};

async function fetchForumHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "PatchNotes/1.0" } });
  return res.text();
}

const jsonHeaders = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
};

/** Handles GET /api/threads?subforum=...&lang=...&page=...
 *
 * Fetches and parses a Path of Exile subforum thread list, caches the
 * parsed result, and returns JSON with `{ threads: [{ url, postedDateISO,
 * title, author }] }`. The response includes CORS headers (`access-control-
 * allow-origin: *`).
 *
 * Cache (`parsed-forum`, TTL 10s) keyed by the full forum URL. On HIT
 * the pre-parsed `ThreadLink[]` is returned without re-fetching.
 *
 * Query params:
 *   subforum — forum ID or name (default "2212")
 *   lang     — "en" | "ru" (default "en")
 *   page     — page number (default "1")
 */
export async function getSubforumThreads(url: URL): Promise<Response> {
  const lang = url.searchParams.get("lang") === "ru" ? "ru" : "en";
  const base = FORUM_BASE[lang];
  const subforum = url.searchParams.get("subforum") || "2212";
  const page = url.searchParams.get("page") || "1";
  const poeUrl = `${base}/view-forum/${subforum}?page=${page}`;
  const cache = await caches.open("parsed-forum");

  const cached = await cache.match(poeUrl);
  if (cached) {
    const json: { threads: ThreadLink[] } = await cached.json();
    const threads = json.threads.map((t) => ({
      url: `${base}/view-thread/${t.id}`,
      postedDateISO: t.createdAt,
      title: t.title,
      author: t.author,
    }));
    return new Response(JSON.stringify({ threads }), { headers: jsonHeaders });
  }

  console.log("[api] MISS", poeUrl);
  const raw = await fetchForumHtml(poeUrl);
  const rawThreads = parseThreadList(raw, lang);
  await cache.put(
    poeUrl,
    new Response(JSON.stringify({ threads: rawThreads }), {
      headers: { "Cache-Control": "public, s-maxage=10" },
    }),
  );
  const threads = rawThreads.map((t) => ({
    url: `${base}/view-thread/${t.id}`,
    postedDateISO: t.createdAt,
    title: t.title,
    author: t.author,
  }));
  return new Response(JSON.stringify({ threads }), { headers: jsonHeaders });
}
