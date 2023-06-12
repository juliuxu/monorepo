import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import {
  parseTodayILearnedEntry,
  parseTodayILearnedEntryBody,
  safeParseTodayILearnedEntryHead,
} from "./parse";
import { chunked, typedBoolean } from "~/misc";
import type { TodayILearnedEntry, TodayILearnedEntryHead } from "./schema";

/**
 * Get all head information from the today i learned database
 * does not include the actual content
 */
export async function getTodayILearnedEntryHeads() {
  const pageEntries = await notionClient.getDatabasePages(
    config.todayILearnedDatabaseId,
    {
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }
  );

  return pageEntries
    .map(safeParseTodayILearnedEntryHead)
    .filter(typedBoolean)
    .filter((entry) => entry.published === "PUBLISHED");
}

/**
 * Fetch and build the complete today i learned entry based on the entry head
 */
export async function getTodayILearnedEntriesFromHeads(
  entryHeads: TodayILearnedEntryHead[]
) {
  const entries: Array<TodayILearnedEntry | undefined> = [];
  for (const chunk of chunked(entryHeads, 5)) {
    const fetchedAndParsed = await Promise.all(
      chunk.map((entryHead) =>
        notionClient
          .getBlocksWithChildren(entryHead.id)
          .then((blocks) => parseTodayILearnedEntryBody(blocks))
          .then((entryBody) => parseTodayILearnedEntry(entryHead, entryBody))
      )
    );
    entries.push(...fetchedAndParsed);
  }

  return entries
    .filter(typedBoolean)
    .filter((entry) => entry.published === "PUBLISHED");
}

export async function getLatestTodayILearnedEntries() {
  const entryHeads = await getTodayILearnedEntryHeads();
  return getTodayILearnedEntriesFromHeads(entryHeads.slice(0, 3));
}