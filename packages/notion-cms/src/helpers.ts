import type {
  BlockObjectResponse,
  RichTextItem,
  SelectColor,
} from "@julianjark/notion-utils";
import { z } from "zod";

export const selectColors: Record<SelectColor, true> = {
  default: true,
  gray: true,
  brown: true,
  orange: true,
  yellow: true,
  green: true,
  blue: true,
  purple: true,
  pink: true,
  red: true,
};
export const selectColorSchema = z.custom<SelectColor>(
  (val) => selectColors[val as SelectColor],
);
export const selectSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: selectColorSchema,
});
export const multiSelectSchema = z.array(selectSchema);

export const blockSchema = z.custom<BlockObjectResponse>((val) => {
  if (typeof val !== "object" || !val) return false;
  if (!("type" in val)) return false;
  if ((val as BlockObjectResponse)?.type === "unsupported") return true;
  return true;
});
export const blocksSchema = z.array(blockSchema);

export const richTextItemSchema = z.custom<RichTextItem>((val) => {
  return val && typeof val === "object" && "type" in val && "text" in val;
});
export const richTextSchema = z.array(richTextItemSchema);

export const publishedStateValues = [
  "PUBLISHED",
  "UNPUBLISHED",
  "DRAFT",
] as const;
export const publishedStateSchema = (
  defaultValue: (typeof publishedStateValues)[number] = "DRAFT",
) => z.preprocess((val) => val || defaultValue, z.enum(publishedStateValues));
export type PublishedState = z.infer<ReturnType<typeof publishedStateSchema>>;

export const filterPublishedPredicate =
  (isPreviewMode: boolean) =>
  ({ published }: { published: PublishedState }) => {
    if (isPreviewMode) {
      return ["PUBLISHED", "DRAFT"].includes(published);
    }
    return published === "PUBLISHED";
  };
