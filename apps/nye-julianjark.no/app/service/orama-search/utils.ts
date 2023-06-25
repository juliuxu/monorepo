import type { SearchResultWithHighlight } from "@orama/plugin-match-highlight";

type HighlightedHits = SearchResultWithHighlight["hits"];

export function groupDocumentsBy(arr: HighlightedHits, key: string) {
  return arr.reduce((acc, current) => {
    const keyValue = current.document[key] as string;

    if (!acc[keyValue]) {
      acc[keyValue] = [];
    }

    acc[keyValue].push(current);
    return acc;
  }, {} as Record<string, HighlightedHits>);
}
