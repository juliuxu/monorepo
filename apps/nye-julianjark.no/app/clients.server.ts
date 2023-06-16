import { config } from "~/config.server";
import { getClientCached } from "@julianjark/notion-client";
import { getAllTodayILearnedEntries } from "./notion-today-i-learned/client";
import {
  getNotionDrivenPages,
  getNotionDrivenPagesWithBlocks,
} from "./routes/$notionPage/client";

export const notionClient = getClientCached({
  tokenOrClient: config.notionToken,
  saveToDisk: process.env.NODE_ENV !== "production",
});

export async function warmUpCache() {
  await Promise.all([
    notionClient.getPage(config.landingPageId),
    notionClient.getBlocksWithChildren(config.landingPageId),
  ]);
  await getAllTodayILearnedEntries();
  const notionDrivenPages = await getNotionDrivenPages();
  await getNotionDrivenPagesWithBlocks(notionDrivenPages);
}

// Warm the cache on startup
if (process.env.NODE_ENV === "production") {
  (async () => {
    console.log("🛢️ Warming up cache...");
    const start = performance.now();
    await warmUpCache();
    const end = performance.now();
    console.log(`✅ Cache warmed up! Took ${end - start}ms`);
  })();
}
