import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getTextFromRichText } from "./helpers";

const headingBlockTypes: BlockObjectResponse["type"][] = [
  "heading_1",
  "heading_2",
  "heading_3",
];

/**
 * Take from the start of a list while a predicate is true
 * modifies the original array
 */
export function takeWhile<T>(list: T[], predicate: (element: T) => boolean) {
  const result: T[] = [];
  while (list.length > 0 && predicate(list[0])) {
    result.push(list.shift()!);
  }
  return result;
}

/**
 * Take a blocks under a header until the next header,
 * but only if the header is present and matching the given string
 * e.g.
 *
 * Given the following blocks:
 * ```
 * # Ingredients
 * - 1
 * - 2
 * # Steps
 * - 3
 * - 4
 * ```
 * takeItemsIfHeaderMatches("Ingredients", blocks) will return `[1, 2]`
 */
export function takeItemsIfHeaderMatches(
  headerToMatch: string,
  currentBlock: BlockObjectResponse,
  blocksUnderneath: BlockObjectResponse[]
) {
  if (!headingBlockTypes.includes(currentBlock.type)) return undefined;

  const headingText = getTextFromRichText(
    (currentBlock as any)[currentBlock.type].rich_text
  );
  if (!headingText.includes(headerToMatch)) return undefined;

  return takeWhile(
    blocksUnderneath,
    (x) => !headingBlockTypes.includes(x.type)
  );
}

/**
 * Find a matching header and take all blocks underneath it untill next header
 */
export const takeBlocksAfterHeader = (
  header: string,
  blocks: BlockObjectResponse[]
) => {
  const blocksCopy = blocks.slice();
  const remainingBlocks: BlockObjectResponse[] = [];
  let takenBlocks: BlockObjectResponse[] = [];
  let block: BlockObjectResponse | undefined;
  while ((block = blocksCopy.shift()) !== undefined) {
    if (
      headingBlockTypes.includes(block.type as any) &&
      getTextFromRichText((block as any)[block.type].rich_text).includes(header)
    ) {
      takenBlocks = takeWhile(
        blocksCopy,
        (x) => !headingBlockTypes.includes(x.type)
      );
    } else {
      remainingBlocks.push(block);
    }
  }

  return [takenBlocks, remainingBlocks];
};
