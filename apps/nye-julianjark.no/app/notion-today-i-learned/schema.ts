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

export const todayILearnedEntrySchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  created: z.string().datetime(),
  tags: z.array(tagSchema),
  blocks: z.array(blockSchema),
  references: z.array(z.string().url()).optional(),
  published: z.preprocess(
    (val) => val || "PUBLISHED",
    z.enum(["PUBLISHED", "UNPUBLISHED", "DEV"])
  ),
});
export type TodayILearnedEntry = z.infer<typeof todayILearnedEntrySchema>;
