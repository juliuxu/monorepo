import { config } from "~/config.server";

import { filterPublishedPredicate } from "~/misc";
import {
  getHeadAndBodyListFromHeads,
  getMetainfo,
  getPages,
} from "./schema-and-mapper";
import { notionClient } from "~/clients.server";

export async function getTodayILearnedEntryHeads() {
  const entryHeads = await getPages(notionClient)(
    config.todayILearnedDatabaseId,
    {
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }
  );
  return entryHeads.success.filter(filterPublishedPredicate);
}

export async function getLatestTodayILearnedEntries() {
  const entryHeads = await getTodayILearnedEntryHeads();
  return (
    await getHeadAndBodyListFromHeads(notionClient)(entryHeads.slice(0, 3))
  ).success;
}

export async function getAllTodayILearnedEntriesAndMetainfo() {
  const [metainfo, entryHeads] = await Promise.all([
    getMetainfo(notionClient)(config.todayILearnedDatabaseId),
    getTodayILearnedEntryHeads(),
  ]);
  const entries = (await getHeadAndBodyListFromHeads(notionClient)(entryHeads))
    .success;
  return { metainfo, entries };
}
