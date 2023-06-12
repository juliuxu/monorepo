import { z } from "zod";
import type { BlockObjectResponse } from "@julianjark/notion-utils";

const blockSchema = z.custom<BlockObjectResponse>((val) => {
  if ((val as BlockObjectResponse)?.type === "unsupported") return false;
  return true;
});
const tagSchema = z.object({
  title: z.string(),
  color: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

export const todayILearnedEntryHeadSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  created: z.string().datetime(),
  tags: z.array(tagSchema),
  published: z.preprocess(
    (val) => val || "PUBLISHED",
    z.enum(["PUBLISHED", "UNPUBLISHED", "DEV"])
  ),
});
export type TodayILearnedEntryHead = z.infer<
  typeof todayILearnedEntryHeadSchema
>;

export const todayILearnedEntryBodySchema = z.object({
  blocks: z.array(blockSchema),
  summary: z.string(),
  references: z.array(z.string().url()).optional(),
});
export type TodayILearnedEntryBody = z.infer<
  typeof todayILearnedEntryBodySchema
>;

export const todayILearnedEntrySchema = todayILearnedEntryHeadSchema.and(
  todayILearnedEntryBodySchema
);
export type TodayILearnedEntry = z.infer<typeof todayILearnedEntrySchema>;
