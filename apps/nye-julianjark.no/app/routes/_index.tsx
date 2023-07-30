import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getLatestTodayILearnedEntries } from "~/service/notion-today-i-learned/client";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenLandingPage } from "../service/notion-driven-page/client";
import { getFeaturedProject } from "~/service/notion-projects/client";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";
import { useEditNotionPage } from "./$notionPage/use-edit-notion-page";

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
      getLatestTodayILearnedEntries(isPreviewModeFromRequest(request)),
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
