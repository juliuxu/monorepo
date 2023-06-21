import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getMetainfo, getPage, getPages } from "./schema-and-mapper";
import { filterPublishedPredicate } from "@julianjark/notion-cms";

async function getAllProjects(isPreview: boolean) {
  const pages = await getPages(notionClient)(config.projectsDatabaseId, {
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

  return pages.success.filter(filterPublishedPredicate(isPreview));
}

export async function getAllProjectsAndMetainfo(isPreview: boolean) {
  const [metainfo, projects] = await Promise.all([
    getMetainfo(notionClient)(config.projectsDatabaseId),
    getAllProjects(isPreview),
  ]);
  return { metainfo, projects };
}

export async function getFeaturedProject() {
  return await getPage(notionClient)(config.featuredProject);
}
