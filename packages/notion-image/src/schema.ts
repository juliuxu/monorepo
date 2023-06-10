import { z } from "zod";

export const imageRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image-block"),
    blockId: z.string(),
  }),
  z.object({
    type: z.literal("page-cover"),
    pageId: z.string(),
  }),
  z.object({
    type: z.literal("page-property"),
    pageId: z.string(),
    property: z.string(),
  }),
]);
export type ImageRequest = z.infer<typeof imageRequestSchema>;
