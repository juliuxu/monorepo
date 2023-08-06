import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getMetainfo, getPages } from "./schema-and-mapper";

export async function getAllDetteKanJeg() {
  const pages = await getPages(notionClient)(config.detteKanJegDatabaseId, {
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });

  // Debug
  // console.log(
  //   pages.failed.map((failed) => ({
  //     unparsed: failed.unparsed,
  //     error: failed.errors.map((e) => JSON.stringify(e, null, 2)).join("\n"),
  //   }))
  // );

  return pages;
}

export async function getDetteKanJegMetainfo() {
  return await getMetainfo(notionClient)(config.detteKanJegDatabaseId);
}

export async function getFeaturedDetteKanJeg() {
  const { success } = await getAllDetteKanJeg();
  return success.filter((v) => v.isFeatured);
}
