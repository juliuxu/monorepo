import {
  getDate,
  getUrl,
  getImage,
  getMultiSelectAndColor,
  getSelectAndColor,
  getSelect,
  getTitle,
  getCover,
  getDatabasePropertySelectOptions,
} from "@julianjark/notion-utils";
import { z } from "zod";

import type { PublishedState } from "@julianjark/notion-cms";
import {
  selectSchema,
  multiSelectSchema,
  publishedStateSchema,
} from "@julianjark/notion-cms";
import { imageUrlBuilder } from "~/routes/api.notion-image";
import { cmsPage, cmsMetainfo } from "@julianjark/notion-cms";

export const portfolioMetainfoSchema = z.object({
  categories: z.array(selectSchema),
  tags: multiSelectSchema,
});
export type PortfolioMetainfo = z.infer<typeof portfolioMetainfoSchema>;
const {} = cmsMetainfo(portfolioMetainfoSchema, (database) => {
  return {
    categories: getDatabasePropertySelectOptions("Category", database),
    tags: getDatabasePropertySelectOptions("Tags", database),
  };
});

export const portfolioSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string().datetime(),
  imageUrl: z.string().url(),
  codeLink: z.string().url().optional(),
  demoLink: z.string().url().optional(),
  category: selectSchema,
  tags: multiSelectSchema,
  published: publishedStateSchema("DRAFT"),
});
export type Portfolio = z.infer<typeof portfolioSchema>;

const {} = cmsPage(portfolioSchema, (page) => {
  return {
    id: page.id,
    title: getTitle(page),
    imageUrl:
      getCover(page) &&
      imageUrlBuilder({
        type: "page-cover",
        pageId: page.id,
      }),
    date: getDate("Date", page),
    image: getImage("Image", page),
    codeLink: getUrl("Code", page),
    demoLink: getUrl("Url", page),
    tags: getMultiSelectAndColor("Tags", page),
    category: getSelectAndColor("Category", page),
    published: getSelect("Published", page) as PublishedState | undefined,
  };
});
