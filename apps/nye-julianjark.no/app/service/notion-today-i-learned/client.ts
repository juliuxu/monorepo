import { config } from "~/config.server";

import {
  getHeadAndBodyListFromHeads,
  getMetainfo,
  getPages,
} from "./schema-and-mapper";
import { notionClient } from "~/clients.server";
import { filterPublishedPredicate } from "@julianjark/notion-cms";

export async function getTodayILearnedEntryHeads(isPreview: boolean) {
  const entryHeads = await getPages(notionClient)(
    config.todayILearnedDatabaseId,
    {
      sorts: [{ property: "Published Date", direction: "descending" }],
    }
  );
  return entryHeads.success.filter(filterPublishedPredicate(isPreview));
}

export async function getLatestTodayILearnedEntries(isPreview: boolean) {
  const entryHeads = await getTodayILearnedEntryHeads(isPreview);
  return (
    await getHeadAndBodyListFromHeads(notionClient)(entryHeads.slice(0, 3))
  ).success;
}

export async function getAllTodayILearnedEntriesAndMetainfo(
  isPreview: boolean
) {
  const [metainfo, entryHeads] = await Promise.all([
    getMetainfo(notionClient)(config.todayILearnedDatabaseId),
    getTodayILearnedEntryHeads(isPreview),
  ]);
  const entries = (await getHeadAndBodyListFromHeads(notionClient)(entryHeads))
    .success;
  return { metainfo, entries };
}
