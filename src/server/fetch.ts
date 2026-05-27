const shortUrl = (u: string) => u.replace("https://www.pathofexile.com/forum", "");

export async function cachedFetch(url: string, ttlSeconds: number): Promise<string> {
  const request = new Request(url);
  const cache = await caches.open("poe-forum");
  const cached = await cache.match(request);
  if (cached) {
    console.log(`[cache] HIT ${shortUrl(url)}`);
    return cached.text();
  }

  console.log(`[cache] MISS ${shortUrl(url)} — fetching`);
  const res = await fetch(url, {
    headers: { "User-Agent": "PatchNotes/1.0" },
    cf: { cacheTtl: ttlSeconds, cacheEverything: true },
  } as RequestInit & { cf: Record<string, unknown> });
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

  console.log(`[cache] STORED ${shortUrl(url)} (${(data.length / 1024).toFixed(1)} KB)`);
  return data;
}
