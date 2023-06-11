import { config } from "~/config.server";
import { getClientCached } from "@julianjark/notion-client";

export const notionClient = getClientCached({
  tokenOrClient: config.notionToken,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  saveToDisk: process.env.NODE_ENV !== "production",
});

export async function warmUpCache() {
  await notionClient.getBlocksWithChildren(config.landingPageId);
}

// Warm the cache on startup
// eslint-disable-next-line turbo/no-undeclared-env-vars
if (process.env.NODE_ENV === "production") {
  (async () => {
    console.log("🛢️ Warming up cache...");
    const start = performance.now();
    await warmUpCache();
    const end = performance.now();
    console.log(`✅ Cache warmed up! Took ${end - start}ms`);
  })();
}
