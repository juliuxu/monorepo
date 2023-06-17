import { z } from "zod";

export const imageRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image-block"),
    blockId: z.string(),
    lastEditedTime: z.string().optional(),
  }),
  z.object({
    type: z.literal("page-cover"),
    pageId: z.string(),
    lastEditedTime: z.string().optional(),
  }),
  z.object({
    type: z.literal("page-property"),
    pageId: z.string(),
    property: z.string(),
    index: z.coerce.number().optional(),
    lastEditedTime: z.string().optional(),
  }),
]);
export type ImageRequest = z.infer<typeof imageRequestSchema>;
