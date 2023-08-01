import {
  getTextFromRichText,
  type BlockObjectResponse,
} from "@julianjark/notion-utils";
import type { CustomBlockKeys } from ".";
import { getDetteKanJegData } from "~/components/dette-kan-jeg";
import { typedBoolean } from "~/misc";

const dataFunctions: Record<
  CustomBlockKeys,
  () => Promise<Record<string, unknown>>
> = {
  BLOCK_REPLACE_DETTE_KAN_JEG: getDetteKanJegData,
  BLOCK_REPLACE_DETTE_KAN_JEG_WANT_TO_LEARN_MORE: getDetteKanJegData,

  // TODO
  BLOCK_REPLACE_LATEST_TODAY_I_LEARNED: () => {
    throw new Error("Function not implemented.");
  },
  BLOCK_REPLACE_FEATURED_PROJECT: () => {
    throw new Error("Function not implemented.");
  },
  BLOCK_REPLACE_SPACER: async () => ({}),
};

/**
 * Go through all blocks and figure out what data is needed and fetch it
 * Makes sure the functions are unique (by reference)
 *
 * TODO: When the datastructure above gets bigger, add code to chunk the requests
 */
export async function getCustomBlocksData(fromBlocks: BlockObjectResponse[]) {
  const dataFunctions = findCustomBlocksDataFunctions(fromBlocks);
  const data = await Promise.all(dataFunctions.map((fn) => fn()));

  // Finally merge
  return data.reduce((r, c) => Object.assign(r, c), {});
}

function findCustomBlocksDataFunctions(
  fromBlocks: BlockObjectResponse[]
): Array<(typeof dataFunctions)[CustomBlockKeys]> {
  return [
    ...new Set(
      fromBlocks
        .flatMap((block) => {
          if (block.type === "callout") {
            const text = getTextFromRichText(block.callout.rich_text);
            return Object.entries(dataFunctions).find(
              ([key]) => key === text
            )?.[1];
          }
          if (block.has_children) {
            return findCustomBlocksDataFunctions(
              (block as any)[block.type]?.children ?? []
            );
          }
          return undefined;
        })
        .filter(typedBoolean)
    ),
  ];
}
