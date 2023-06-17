import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getPages } from "./schema-and-mapper";
import { filterPublishedPredicate } from "@julianjark/notion-cms";

export async function getAllPortfolioItems() {
  const pages = await getPages(notionClient)(config.portfolioDatabaseId, {
    sorts: [
      {
        property: "Dato",
        direction: "descending",
      },
    ],
    filter: {
      property: "Published",
      select: {
        is_not_empty: true,
      },
    },
  });

  return {
    success: pages.success.filter(filterPublishedPredicate),
    failed: pages.failed,
  };
}
