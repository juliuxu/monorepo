import type { BlockObjectResponse } from "@julianjark/notion-utils";
import { getTextFromRichText } from "@julianjark/notion-utils";

/**
 * Get first paragraph and use as the summary
 */
export function getSummary(fromBlocks: BlockObjectResponse[]) {
  const summary = fromBlocks
    .filter((x) => x.type === "paragraph")
    .slice(0, 1)
    .map((p) =>
      p.type === "paragraph" ? getTextFromRichText(p.paragraph.rich_text) : "",
    )
    .join(".\n")
    .replace(/([^.])\.\.\n/, "$1. ");
  return summary;
}
