import { useShortcut } from "@julianjark/dev-tools";

/**
 * Let's the author quickly edit the page in Notion
 */
export function useEditNotionPage({ pageId }: { pageId: string }) {
  useShortcut("ee", () => {
    // As of 11. july 2023 Notion figures out which page this belongs to and opens it correctly
    window.open(`https://notion.so/${pageId.replaceAll("-", "")}`, "_blank");
  });
}
