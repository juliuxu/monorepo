import {
  getTextFromRichText,
  type BlockObjectResponse,
  type RichTextItem,
} from "@julianjark/notion-utils";
import type {
  ShikifiedCodeBlock,
  ShikifiedRichTextItem,
} from "../server/prepare";
import { useState } from "react";

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
  style?: React.CSSProperties;
}
export function NotionShikiCode({
  block,
  className,
  style,
}: NotionShikiCodeProps) {
  if (!isShikifiedCodeBlock(block)) {
    console.warn("non-sikiified code block passed to NotionShikiCode");
    return null;
  }

  // This is fine. The component is always rendered or it is not
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isCopied, setIsCopied] = useState(false);
  async function copyToClipboard() {
    if (!isShikifiedCodeBlock(block)) return;
    if (isCopied) return;
    await navigator.clipboard.writeText(
      getTextFromRichText(block.code.rich_text)
    );
    setIsCopied(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsCopied(false);
  }

  return (
    <figure
      className={className}
      style={
        {
          position: "relative",
          "--shiki-foreground": block.code.foregroundColor,
          "--shiki-background": block.code.backgroundColor,
          ...style,
        } as any
      }
    >
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: block.code.codeHtml }}
      />
      {block.code.textCaption && (
        <figcaption>{block.code.textCaption}</figcaption>
      )}

      {/* Copyable */}
      {block.code.options.copyable && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            color: block.code.foregroundColor,
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
          lang="en"
          aria-live="polite"
        >
          {isCopied ? <span style={{ fontSize: 14 }}>Copied!</span> : null}
          <button
            title="Copy to clipboard"
            onClick={copyToClipboard}
            style={{
              opacity: isCopied ? 1 : undefined,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
              aria-hidden="true"
            >
              <path d="M7.5 18.98q-.63 0-1.06-.44T6 17.48v-14q0-.63.44-1.07t1.06-.44h11q.63 0 1.06.44T20 3.47v14q0 .63-.44 1.07t-1.06.44Zm0-1.5h11v-14h-11v14Zm-3 4.5q-.63 0-1.06-.44T3 20.48V6.15q0-.33.21-.54.21-.21.54-.21.33 0 .54.21.21.21.21.54v14.32h11.1q.33 0 .54.22.21.21.21.53 0 .33-.21.54-.22.22-.54.22Zm3-18.5v14-14Z" />
            </svg>
          </button>
        </div>
      )}
    </figure>
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
