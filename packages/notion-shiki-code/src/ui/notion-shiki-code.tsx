import { BlockObjectResponse, RichTextItem } from "@julianjark/notion-utils";
import type {
  ShikifiedCodeBlock,
  ShikifiedRichTextItem,
} from "../server/prepare";

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
export function NotionShikiCode({ block, className }: NotionShikiCodeProps) {
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
}

function isShikifiedRichTextItem(
  richText: RichTextItem
): richText is ShikifiedRichTextItem {
  if ("codeHtml" in richText) return true;
  return false;
}

interface NotionShikiCodeRichTextProps {
  richText: any | RichTextItem;
  className?: string;
}
export function NotionShikiCodeRichText({
  richText,
  className,
}: NotionShikiCodeRichTextProps) {
  if (!isShikifiedRichTextItem(richText)) {
    console.warn(
      "non-sikiified rich text item passed to NotionShikiCodeRichText"
    );
    return null;
  }

  return (
    <span
      style={{ display: "contents" }}
      className={className}
      dangerouslySetInnerHTML={{ __html: richText.codeHtml }}
    />
  );
}
