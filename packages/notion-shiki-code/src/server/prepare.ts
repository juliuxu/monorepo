import { BUNDLED_LANGUAGES, type Lang, type Theme } from "shiki";
import {
  getTextFromRichText,
  type BlockObjectResponse,
  RichTextItem,
} from "@julianjark/notion-utils";
import { z } from "zod";
import { shikiTransform } from "./shiki";

const stringBoolean = z.preprocess((val) => {
  if (typeof val === "string") {
    return val === "true";
  }
  return val;
}, z.boolean());

const optionsSchema = z.object({
  language: z.custom<Lang>((value) => typeof value === "string").optional(),
  theme: z.custom<Theme>((value) => typeof value === "string").optional(),

  caption: z.string().optional(),
  filename: z.string().optional(),
  linenumbers: stringBoolean.optional(),
  copyable: stringBoolean.optional(),
  highlight: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .flatMap((section) => {
            const split = section.split("-");
            // case 1: single number
            if (split.length === 1) return Number.parseInt(split[0]);

            // case 2: range
            const first = Number.parseInt(split[0]);
            const second = Number.parseInt(split[1]);
            if (!Number.isInteger(first) || !Number.isInteger(second))
              return NaN;

            return [...Array(second - first + 1).keys()].map((x) => x + first);
          })
          .filter(Number.isInteger);
      }
      return val;
    }, z.array(z.number()))
    .optional(),
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

  const captionOptions = Object.fromEntries(
    new URLSearchParams(getTextFromRichText(block.code.caption))
  );
  const blockOptions = optionsSchema.parse({
    ...captionOptions,

    linenumbers: captionOptions.linenumbers ?? "false",
    copyable: captionOptions.copyable ?? captionOptions.copy ?? "true",
  });

  const options = {
    ...providedOptions,
    ...blockOptions,
  };

  let language = options.language ?? (block.code.language as Lang);
  if (
    !BUNDLED_LANGUAGES.some(
      (bundledLanguage) => bundledLanguage.id === language
    )
  )
    (language as string) = "";

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
  (block as unknown as ShikifiedCodeBlock).code.options = options;
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
