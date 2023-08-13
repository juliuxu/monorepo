import type { Orama } from "@orama/orama";
import { create, insertMultiple } from "@orama/orama";
import { afterInsert as highlightAfterInsertHook } from "@orama/plugin-match-highlight";

import type { TodayILearnedEntry } from "../notion-today-i-learned/schema-and-mapper";

type OramaDoc = {
  id: string;
  title: string;
  url: string;
  content: string;
};

export async function createTodayILearnedOramaIndex(
  entries: TodayILearnedEntry[],
): Promise<Orama> {
  const index = await create({
    schema: {
      id: "string",
      title: "string",
      url: "string",
      content: "string",
    },
    components: {
      afterInsert: [highlightAfterInsertHook],
      tokenizer: {
        stemming: false,
      },
    },
  });

  const documents: OramaDoc[] = [];
  for (const entry of entries) {
    const url = `/i-dag-lærte-jeg/${entry.slug}`;
    const title = entry.title;

    // The index is built after render, meaning the browser already has the text content
    // So, instead of parsing the blocks, we can just grab the text content from the DOM
    const contentElement = document.querySelector(
      `#${entry.slug} + div`,
    ) as HTMLElement | null;
    const content = contentElement?.innerText ?? "";

    documents.push({
      id: url,
      title,
      url,
      content,
    });
  }

  await insertMultiple(index, documents);

  return index;
}
