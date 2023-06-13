import type {
  BlockObjectResponse,
  RichTextItem,
} from "@julianjark/notion-utils";
import { z } from "zod";

const blockSchema = z.custom<BlockObjectResponse>((val) => {
  if ((val as BlockObjectResponse)?.type === "unsupported") return false;
  return true;
});
const richTextItemSchema = z.custom<RichTextItem>((val) => {
  return val && typeof val === "object" && "type" in val && "text" in val;
});
export const notionDrivenPageSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  preamble: z.array(richTextItemSchema).nonempty(),
  published: z.preprocess(
    (val) => val || "PUBLISHED",
    z.enum(["PUBLISHED", "UNPUBLISHED", "DEV"])
  ),
});
export type NotionDrivenPage = z.infer<typeof notionDrivenPageSchema>;

export const notionDrivenPageAndBlocksSchema = z.object({
  page: notionDrivenPageSchema,
  blocks: z.array(blockSchema),
});
export type NotionDrivenPageAndBlocks = z.infer<
  typeof notionDrivenPageAndBlocksSchema
>;
