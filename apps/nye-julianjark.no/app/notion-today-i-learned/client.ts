import { config } from "~/config.server";

import { filterPublishedPredicate } from "~/misc";
import { getHeadAndBodyListFromHeads, getPages } from "./schema-and-mapper";

export async function getTodayILearnedEntryHeads() {
  const entryHeads = await getPages(config.todayILearnedDatabaseId, {
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });
  return entryHeads.success.filter(filterPublishedPredicate);
}

export async function getLatestTodayILearnedEntries() {
  const entryHeads = await getTodayILearnedEntryHeads();
  return (await getHeadAndBodyListFromHeads(entryHeads.slice(0, 3))).success;
}

export async function getAllTodayILearnedEntries() {
  const entryHeads = await getTodayILearnedEntryHeads();
  return (await getHeadAndBodyListFromHeads(entryHeads)).success;
}
