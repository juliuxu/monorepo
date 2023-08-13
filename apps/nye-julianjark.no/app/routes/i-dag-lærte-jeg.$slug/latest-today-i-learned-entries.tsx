import { useLoaderData } from "@remix-run/react";

import type { loader } from "~/routes/_index";
import { TodayILearnedArticlePreviewList } from "./today-i-learned-article-preview";

export function LatestTodayILearnedEntries() {
  const { latestTodayILearnedEntries } = useLoaderData<typeof loader>();
  return (
    <TodayILearnedArticlePreviewList
      titleAs="h3"
      entries={latestTodayILearnedEntries}
    />
  );
}
