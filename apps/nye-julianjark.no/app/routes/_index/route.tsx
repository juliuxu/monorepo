import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getLatestTodayILearnedEntries } from "~/service/notion-today-i-learned/client";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenLandingPage } from "../$notionPage/client";
import { getFeaturedProject } from "~/service/notion-projects/client";
import { isPreviewMode } from "../api.preview-mode/preview-mode.server";
import { useEditNotionPage } from "../$notionPage/route";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const [page, featuredProject, latestTodayILearnedEntries] = await Promise.all(
    [
      getNotionDrivenLandingPage(),
      getFeaturedProject(),
      getLatestTodayILearnedEntries(await isPreviewMode(request)),
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

export default function Component() {
  const data = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: data.page.id });
  return <NotionPage {...data} />;
}
