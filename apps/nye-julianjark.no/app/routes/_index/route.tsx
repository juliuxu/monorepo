import type { HeadersFunction } from "@remix-run/node";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getLatestTodayILearnedEntries } from "~/notion-today-i-learned/client";
import { parseNotionDrivenPage } from "../$notionPage/parse";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

export const loader = async () => {
  const [page, blocks, latestTodayILearnedEntries] = await Promise.all([
    notionClient.getPage(config.landingPageId).then(parseNotionDrivenPage),
    notionClient.getBlocksWithChildren(config.landingPageId),
    getLatestTodayILearnedEntries(),
  ]);

  return json({
    page,
    blocks,
    latestTodayILearnedEntries,
  });
};
export const headers: HeadersFunction = () => config.cacheControlHeaders;

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return <NotionPage {...data} />;
}
