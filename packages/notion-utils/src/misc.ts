import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getTextFromRichText } from "./helpers";

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
  const headingBlockTypes: BlockObjectResponse["type"][] = [
    "heading_1",
    "heading_2",
    "heading_3",
  ];
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
