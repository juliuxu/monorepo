import type { Lang, Theme } from "shiki";
import {
  getTextFromRichText,
  type BlockObjectResponse,
  RichTextItem,
} from "@julianjark/notion-utils";
import { z } from "zod";
import { shikiTransform } from "./shiki";

const optionsSchema = z.object({
  language: z.custom<Lang>((value) => typeof value === "string").optional(),
  theme: z.custom<Theme>((value) => typeof value === "string").optional(),

  filename: z.string().optional(),
  highlightLines: z.array(z.number()).optional(),
  copyable: z.boolean().default(true).optional(),
});
export type Options = z.infer<typeof optionsSchema>;

export type ShikifiedCodeBlock = Extract<
  BlockObjectResponse,
  { type: "code" }
> & {
  code: Extract<BlockObjectResponse, { type: "code" }>["code"] & {
    codeHtml: string;
    options: Options;
    foregroundColor: string;
    backgroundColor: string;
  };
};

export type ShikifiedRichTextItem = RichTextItem & {
  foregroundColor: string;
  backgroundColor: string;
  codeHtml: string;
};

/**
 * Modify a code block to include shiki html
 */
export async function shikifyNotionBlock(
  block: BlockObjectResponse,
  providedOptions: Partial<Options>
) {
  if (block.type !== "code") return;

  const blockOptions = optionsSchema.parse(
    Object.fromEntries(
      new URLSearchParams(getTextFromRichText(block.code.caption))
    )
  );
  const options = {
    ...providedOptions,
    ...blockOptions,
  };
  const language = options.language ?? (block.code.language as Lang);
  const { codeHtml, foregroundColor, backgroundColor } = await shikiTransform(
    getTextFromRichText(block.code.rich_text),
    { ...options, language }
  );

  // Mutate the block to include our new properties
  (block as unknown as ShikifiedCodeBlock).code.codeHtml = codeHtml;
  (block as unknown as ShikifiedCodeBlock).code.foregroundColor =
    foregroundColor;
  (block as unknown as ShikifiedCodeBlock).code.backgroundColor =
    backgroundColor;
}

/**
 * Mutates a list of blocks to include shiki html
 */
export async function shikifyNotionBlocks(
  blocks: BlockObjectResponse[],
  providedOptions: Partial<Options>,
  includeRichText = true
) {
  for (const block of blocks) {
    await shikifyNotionBlock(block, providedOptions);

    // Shikify rich text as well
    if (includeRichText && "rich_text" in (block as any)[block.type]) {
      await shikifyRichTextList(
        (block as any)[block.type].rich_text,
        providedOptions
      );
    }

    if (block.has_children) {
      await shikifyNotionBlocks(
        (block as any)[block.type]?.children ?? [],
        providedOptions
      );
    }
  }
  return blocks;
}

export async function shikifyRichTextList(
  richTextList: RichTextItem[],
  providedOptions: Options
) {
  for (const richText of richTextList) {
    if (richText.type === "equation") continue;

    if (richText.annotations.code) {
      const { codeHtml, foregroundColor, backgroundColor } =
        await shikiTransform(richText.plain_text, providedOptions, "inlined");
      (richText as unknown as ShikifiedRichTextItem).codeHtml = codeHtml;
      (richText as unknown as ShikifiedRichTextItem).foregroundColor =
        foregroundColor;
      (richText as unknown as ShikifiedRichTextItem).backgroundColor =
        backgroundColor;
    }
  }
}
