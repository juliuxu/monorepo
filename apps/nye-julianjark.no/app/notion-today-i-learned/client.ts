import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { parseTodayILearnedEntry as safeParseTodayILearnedEntry } from "./parse";
import { chunked, typedBoolean } from "~/misc";
import type { TodayILearnedEntry } from "./schema";

export async function getTodayILearnedEntries() {
  const pageEntries = await notionClient.getDatabasePages(
    config.todayILearnedDatabaseId,
    {
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }
  );

  const entries: Array<TodayILearnedEntry | undefined> = [];
  for (const pages of chunked(pageEntries, 5)) {
    const fetchedAndParsed = await Promise.all(
      pages.map((page) =>
        notionClient
          .getBlocksWithChildren(page.id)
          .then((blocks) => safeParseTodayILearnedEntry(page, blocks))
      )
    );
    entries.push(...fetchedAndParsed);
  }

  return entries
    .filter(typedBoolean)
    .filter((entry) => entry.published === "PUBLISHED");
}
