import { json, type LoaderArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getTextFromRichText } from "@julianjark/notion-utils";

import { config } from "~/config.server";
import { NotionPage } from "~/routes/($prefix).$notionPage/notion-driven-page";
import { getFeaturedProject } from "~/service/notion-projects/client";
import { getLatestTodayILearnedEntries } from "~/service/notion-today-i-learned/client";
import { getNotionDrivenLandingPage } from "../service/notion-driven-page/client";
import { useEditNotionPage } from "./($prefix).$notionPage/use-edit-notion-page";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: getTextFromRichText(data!.page.preamble) },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const [page, featuredProject, latestTodayILearnedEntries] = await Promise.all(
    [
      getNotionDrivenLandingPage(),
      getFeaturedProject(),
      getLatestTodayILearnedEntries(isPreviewModeFromRequest(request)),
    ],
  );

  return json(
    {
      page,
      featuredProject,
      latestTodayILearnedEntries,
    },
    { headers: config.loaderCacheControlHeaders },
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: data.page.id });
  return <NotionPage {...data} />;
}
