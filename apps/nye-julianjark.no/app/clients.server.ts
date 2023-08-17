import { getClientCached } from "@julianjark/notion-client";

import { config } from "~/config.server";
import {
  getAllProjectsAndMetainfo,
  getFeaturedProject,
} from "~/service/notion-projects/client";
import {
  getAllTodayILearnedEntriesAndMetainfo,
  getLatestTodayILearnedEntries,
} from "~/service/notion-today-i-learned/client";
import { getNotionDrivenPages } from "./service/notion-driven-page/client";

export const notionClient = getClientCached({
  tokenOrClient: config.notionToken,
  saveToDisk: process.env.NODE_ENV !== "production",
});

let isWarmingUpCache = false;

/**
 * Warm up the cache
 * Since the cache is in-memory it needs to be repopulated on restarts and redeploys
 */
export async function warmUpCache() {
  if (isWarmingUpCache) return;
  isWarmingUpCache = true;
  try {
    // The landing page
    await Promise.all([
      notionClient.getPage(config.landingPageId),
      notionClient.getBlocksWithChildren(config.landingPageId),
    ]);
    await getFeaturedProject();
    await getLatestTodayILearnedEntries(false);
    console.log("◈ warmed up cache for landing page");

    // The notion driven pages
    const notionDrivenPages = await getNotionDrivenPages(false);
    for (const page of notionDrivenPages) {
      await notionClient.getBlocksWithChildren(page.id);
    }
    console.log("◈ warmed up cache for notion driven pages");

    // The project pages
    await getAllTodayILearnedEntriesAndMetainfo(false);
    await getAllProjectsAndMetainfo(false);
    console.log("◈ warmed up cache for project pages");

    // Hit the most important pages to rebuild the cdn/nginx http response cache
    await Promise.all([
      fetch("https://julianjark.no"),
      fetch("https://julianjark.no/i-dag-lærte-jeg"),
      fetch("https://julianjark.no/prosjekter"),
      fetch("https://julianjark.no/om-julian"),
    ]);
  } catch (e) {
    console.error(`Failed warming up cache ${e}`);
  } finally {
    isWarmingUpCache = false;
  }
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
