import {
  cmsMetainfo,
  cmsPage,
  multiSelectSchema,
  richTextSchema,
  selectSchema,
} from "@julianjark/notion-cms";
import {
  getFileUrls,
  getMultiSelectAndColor,
  getRichText,
  getSelect,
  getSelectAndColor,
  getTextFromRichText,
  getTitle,
  getUrl,
} from "@julianjark/notion-utils";
import { z } from "zod";

import { imageUrlBuilder } from "~/routes/api.notion-image";

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
  },
);

export const detteKanJegSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    link: z.string().url().optional(),
    type: selectSchema,
    tags: multiSelectSchema,
    description: richTextSchema.optional(),
    logo: z.string().url().optional(),
    competence: z
      .enum([
        "Kan men ønsker ikke å jobbe med",
        "Ønsker å lære mer om",
        "known",
      ])
      .default("known")
      .transform(
        (v) =>
          (
            ({
              known: "known",
              "Kan men ønsker ikke å jobbe med": "known",
              "Ønsker å lære mer om": "want-to-learn-more",
            }) as const
          )[v],
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
    link: getUrl("Link", page),
    type: getSelectAndColor("Type", page),
    tags: getMultiSelectAndColor("Tags", page),
    description: getRichText("Beskrivelse", page),
    logo: getFileUrls("Logo", page)?.map((_, index) =>
      imageUrlBuilder({
        type: "page-property",
        pageId: page.id,
        property: "Logo",
        index,
        lastEditedTime: page.last_edited_time,
      }),
    )[0],
    competence: getSelect("Ferdighet og Motivasjon", page) as any,

    // To keep typescript happy, the added options needs to be defined here
    // The alternative is to not have any type safety here at all
    isFeatured: undefined,
  };
});
