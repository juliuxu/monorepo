import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { assertItemFound } from "~/misc";
import { isPreviewModeFromRequest } from "../api.preview-mode/preview-mode.server";
import { useEditNotionPage } from "../$notionPage/use-edit-notion-page";
import { TodayILearnedArticle } from "./today-i-learned-article";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.entry.title },
    {
      name: "description",
      content: data?.entry.summary,
    },
  ];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug ?? "";
  const { metainfo, entries } = await getAllTodayILearnedEntriesAndMetainfo(
    isPreviewModeFromRequest(request)
  );
  const entry = entries.find((entry) => entry.slug === slug);
  assertItemFound(entry);

  return json(
    {
      metainfo,
      entry,
    },
    { headers: config.loaderCacheControlHeaders }
  );
};

export default function Component() {
  const { entry } = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: entry.id });
  return (
    <main className="max-w-3xl mx-auto">
      <TodayILearnedArticle entry={entry} titleAs="h1" />
    </main>
  );
}
