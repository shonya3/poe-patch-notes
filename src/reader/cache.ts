export async function cachedFetch(url: string, ttlSeconds: number): Promise<string> {
  const request = new Request(url);
  const cache = await caches.open("poe-forum");
  const cached = await cache.match(request);
  if (cached) return cached.text();

  const res = await fetch(url, {
    headers: { "User-Agent": "PoEForumReader/1.0" },
    cf: { cacheTtl: ttlSeconds, cacheEverything: true },
  });
  const data = await res.text();

  await cache.put(
    request,
    new Response(data, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/html",
        "Cache-Control": `public, max-age=${ttlSeconds}`,
      },
    }),
  );

  return data;
}

export function cacheHeaders(): Record<string, string> {
  return {
    // "Cache-Control": `public, s-maxage=${ttlSeconds}`,
    "Cache-Control": "private, no-cache",
  };
}
