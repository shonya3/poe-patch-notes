import handler from "@tanstack/react-start/server-entry";
import { getSubforumThreads } from "./api/threads";

const CACHE_SSR = "SSR_CACHE";

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/threads") {
      return getSubforumThreads(url);
    }

    if (import.meta.env.PROD && request.method === "GET" && url.pathname.startsWith("/thread/")) {
      const cache = await caches.open(CACHE_SSR);
      const cacheKey = url.origin + url.pathname;

      const cached = await cache.match(cacheKey);
      if (cached) {
        console.log("[ssr-cache] HIT", url.pathname);
        return cached;
      }

      console.log("[ssr-cache] MISS", url.pathname);
      const response = await handler.fetch(request);
      if (response.status === 200) {
        const body = await response.clone().text();
        const cachedRes = new Response(body, response);
        cachedRes.headers.set("Cache-Control", "public, s-maxage=30");
        await cache.put(cacheKey, cachedRes);
        console.log("[ssr-cache] STORE", url.pathname, body.length);
      }
      return response;
    }

    return handler.fetch(request);
  },
};
