import {
  getMultiSelectAndColor,
  getSelect,
  getSelectAndColor,
  getTextFromRichText,
  getTitle,
} from "@julianjark/notion-utils";
import { z } from "zod";

import {
  selectSchema,
  multiSelectSchema,
  richTextSchema,
  cmsMetainfo,
} from "@julianjark/notion-cms";
import { cmsPage } from "@julianjark/notion-cms";

export const detteKanJegMetainfoSchema = z.object({
  title: z.string(),
  description: richTextSchema,
});
export type DetteKanJegMetainfo = z.infer<typeof detteKanJegMetainfoSchema>;
export const { getMetainfo } = cmsMetainfo(
  detteKanJegMetainfoSchema,
  (database) => {
    return {
      title: getTextFromRichText(database.title),
      description: database.description,
    };
  }
);

export const detteKanJegSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    type: selectSchema,
    tags: multiSelectSchema,
    competence: z
      .enum([
        "Kan men ønsker ikke å jobbe med",
        "Ønsker å lære mer om",
        "known",
      ])
      .default("known")
      .transform(
        (v) =>
          ((
            {
              known: "known",
              "Kan men ønsker ikke å jobbe med": "known",
              "Ønsker å lære mer om": "want-to-learn-more",
            } as const
          )[v])
      ),
  })
  .transform((v) => ({
    ...v,
    isFeatured: v.tags.some((tag) => tag.title === "⭐️"),
  }));
export type DetteKanJeg = z.infer<typeof detteKanJegSchema>;

export const { getPages } = cmsPage(detteKanJegSchema, (page) => {
  return {
    id: page.id,
    title: getTitle(page),
    type: getSelectAndColor("Type", page),
    tags: getMultiSelectAndColor("Tags", page),
    competence: getSelect("Ferdighet og Motivasjon", page) as any,

    // To keep typescript happy, the added options needs to be defined here
    // The alternative is to not have any type safety here at all
    isFeatured: undefined,
  };
});
