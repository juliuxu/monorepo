import { useEffect } from "react";

// This lets the notion editing be triggered from anywhere in the app
let currentNotionPageId: string | undefined;
export function openCurrentNotionPage() {
  if (!currentNotionPageId) return;

  // As of 11. july 2023 Notion figures out which page this belongs to and opens it correctly
  window.open(
    `https://notion.so/${currentNotionPageId.replaceAll("-", "")}`,
    "_blank"
  );
}

/**
 * Let's editors quickly edit the page in Notion
 * Requires that somewhere else in the app calls `openCurrentNotionPage`
 */
export function useEditNotionPage({ pageId }: { pageId: string }) {
  useEffect(() => {
    const previousNotionPageId = currentNotionPageId;
    currentNotionPageId = pageId;

    // Use the previous pageId when this unmounts
    // This allows us to use this in dialogs and other places temporary components
    return () => {
      if (currentNotionPageId === pageId) {
        currentNotionPageId = previousNotionPageId;
      }
    };
  }, [pageId]);
}

export function RegisterEditNotionPage({ pageId }: { pageId: string }) {
  useEditNotionPage({ pageId });
  return null;
}
