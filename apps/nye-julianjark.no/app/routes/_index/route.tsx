import type { HeadersFunction } from "@remix-run/node";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getLatestTodayILearnedEntries } from "~/notion-today-i-learned/client";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenLandingPage } from "../$notionPage/client";
import { getFeaturedProject } from "~/notion-projects/client";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

export const loader = async () => {
  const [page, featuredProject, latestTodayILearnedEntries] = await Promise.all(
    [
      getNotionDrivenLandingPage(),
      getFeaturedProject(),
      getLatestTodayILearnedEntries(),
    ]
  );

  return json(
    {
      page,
      featuredProject,
      latestTodayILearnedEntries,
    },
    { headers: config.loaderCacheControlHeaders }
  );
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return <NotionPage {...data} />;
}
