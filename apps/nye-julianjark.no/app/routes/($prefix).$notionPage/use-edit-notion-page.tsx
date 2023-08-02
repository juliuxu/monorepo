import { useEffect } from "react";

// This lets the notion editing be triggered from anywhere in the app
// Although not not ideal, it works
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
    currentNotionPageId = pageId;
  }, [pageId]);
}
