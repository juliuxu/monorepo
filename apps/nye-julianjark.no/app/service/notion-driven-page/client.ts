import { filterPublishedPredicate } from "@julianjark/notion-cms";

import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getBodyFromHead, getPage, getPages } from "./schema-and-mapper";

export async function getNotionDrivenLandingPage() {
  const page = await getPage(notionClient)(config.landingPageId);
  return await getBodyFromHead(notionClient)(page);
}

export async function getNotionDrivenPages(isPreview: boolean) {
  const pages = await getPages(notionClient)(
    config.notionDrivenPagesDatabaseId,
    {},
  );
  return pages.success.filter(filterPublishedPredicate(isPreview));
}

export async function getNotionDrivenPageWithBlocks({
  prefix = "",
  slug,
  isPreview,
}: {
  prefix?: string;
  slug: string;
  isPreview: boolean;
}) {
  const pages = await getNotionDrivenPages(isPreview);
  const page = pages.find(
    (page) =>
      page.prefix?.toLowerCase() === prefix?.toLowerCase() &&
      page.slug.toLowerCase() === slug.toLowerCase(),
  );
  if (!page) return undefined;

  return await getBodyFromHead(notionClient)(page);
}
