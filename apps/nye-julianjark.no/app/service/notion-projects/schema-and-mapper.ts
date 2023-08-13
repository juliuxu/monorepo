import type { PublishedState } from "@julianjark/notion-cms";
import {
  cmsMetainfo,
  cmsPage,
  multiSelectSchema,
  publishedStateSchema,
  richTextSchema,
  selectSchema,
} from "@julianjark/notion-cms";
import {
  getDatabasePropertyMultiSelectOptions,
  getDatabasePropertySelectOptions,
  getDate,
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

export const projectsMetainfoSchema = z.object({
  title: z.string(),
  description: richTextSchema,
  forWhom: z.array(selectSchema),
  tags: multiSelectSchema,
});
export type ProjectsMetainfo = z.infer<typeof projectsMetainfoSchema>;
export const { getMetainfo } = cmsMetainfo(
  projectsMetainfoSchema,
  (database) => {
    return {
      title: getTextFromRichText(database.title),
      description: database.description,
      forWhom: getDatabasePropertySelectOptions("For hvem", database),
      tags: getDatabasePropertyMultiSelectOptions("Tags", database),
    };
  },
);

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: richTextSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  imageUrls: z.array(z.string().url()),
  codeLink: z.string().url().optional(),
  demoLink: z.string().url().optional(),
  forWhom: selectSchema,
  tags: multiSelectSchema,
  published: publishedStateSchema("PUBLISHED"),
});
export type Project = z.infer<typeof projectSchema>;

export const { getPage, getPages } = cmsPage(projectSchema, (page) => {
  return {
    id: page.id,
    title: getTitle(page),
    description: getRichText("Beskrivelse", page),
    imageUrls: getFileUrls("Bilder", page)?.map((_, index) =>
      imageUrlBuilder({
        type: "page-property",
        pageId: page.id,
        property: "Bilder",
        index,
        lastEditedTime: page.last_edited_time,
      }),
    ),
    date: getDate("Dato", page),
    codeLink: getUrl("Kode", page),
    demoLink: getUrl("Link", page),
    tags: getMultiSelectAndColor("Tags", page),
    forWhom: getSelectAndColor("For hvem", page),
    published: getSelect("Published", page) as PublishedState | undefined,
  };
});
