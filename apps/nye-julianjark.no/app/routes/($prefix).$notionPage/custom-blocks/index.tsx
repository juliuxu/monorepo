import type { BlockComponentProps } from "@julianjark/notion-render";
import { getTextFromRichText } from "@julianjark/notion-utils";
import {
  DetteKanJegBlock,
  DetteKanJegWantToLearnMoreBlock,
} from "~/components/dette-kan-jeg";
import { FeaturedProject } from "~/routes/($prefix).$notionPage/custom-blocks/featured-project";
import { LatestTodayILearnedEntries } from "./latest-today-i-learned-entries";
import { Spacer } from "./spacer";

export const customBlocksToComponents = {
  BLOCK_REPLACE_LATEST_TODAY_I_LEARNED: <LatestTodayILearnedEntries />,
  BLOCK_REPLACE_FEATURED_PROJECT: <FeaturedProject />,
  BLOCK_REPLACE_DETTE_KAN_JEG: <DetteKanJegBlock />,
  BLOCK_REPLACE_DETTE_KAN_JEG_WANT_TO_LEARN_MORE: (
    <DetteKanJegWantToLearnMoreBlock />
  ),
  BLOCK_REPLACE_SPACER: <Spacer />,
} as const satisfies Record<string, JSX.Element>;
export type CustomBlockKeys = keyof typeof customBlocksToComponents;

export function CustomBlock({ block }: BlockComponentProps) {
  if (block.type !== "callout") return null;
  const text = getTextFromRichText(block.callout.rich_text);

  return (
    Object.entries(customBlocksToComponents).find(
      ([key]) => key === text
    )?.[1] ?? null
  );
}
