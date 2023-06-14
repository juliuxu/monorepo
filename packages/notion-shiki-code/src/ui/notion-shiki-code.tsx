import { BlockObjectResponse } from "@julianjark/notion-utils";
import type { ShikifiedCodeBlock } from "../server/prepare";

function isShikifiedCodeBlock(
  block: BlockObjectResponse
): block is ShikifiedCodeBlock {
  if (block.type !== "code") return false;
  if ("codeHtml" in block.code) return true;
  return false;
}

interface NotionShikiCodeProps {
  block: any | BlockObjectResponse;
  className?: string;
}
export const NotionShikiCode = ({ block, className }: NotionShikiCodeProps) => {
  if (!isShikifiedCodeBlock(block)) {
    console.warn("non-sikiified code block passed to NotionShikiCode");
    return null;
  }

  return (
    <div
      style={{ display: "contents" }}
      className={className}
      dangerouslySetInnerHTML={{ __html: block.code.codeHtml }}
    />
  );
};
