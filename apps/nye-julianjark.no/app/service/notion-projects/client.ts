import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getMetainfo, getPage, getPages } from "./schema-and-mapper";
import { filterPublishedPredicate } from "@julianjark/notion-cms";

async function getAllProjects() {
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

  return pages.success.filter(filterPublishedPredicate);
}

export async function getAllProjectsAndMetainfo() {
  const [metainfo, projects] = await Promise.all([
    getMetainfo(notionClient)(config.projectsDatabaseId),
    getAllProjects(),
  ]);
  return { metainfo, projects };
}

export async function getFeaturedProject() {
  return await getPage(notionClient)(config.featuredProject);
}
