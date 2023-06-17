import {
  getDate,
  getUrl,
  getMultiSelectAndColor,
  getSelectAndColor,
  getSelect,
  getTitle,
  getFileUrls,
} from "@julianjark/notion-utils";
import { z } from "zod";

import type { PublishedState } from "@julianjark/notion-cms";
import {
  selectSchema,
  multiSelectSchema,
  publishedStateSchema,
} from "@julianjark/notion-cms";
import { imageUrlBuilder } from "~/routes/api.notion-image";
import { cmsPage } from "@julianjark/notion-cms";

// export const projectsMetainfoSchema = z.object({
//   categories: z.array(selectSchema),
//   tags: multiSelectSchema,
// });
// export type ProjectsMetainfo = z.infer<typeof projectsMetainfoSchema>;
// const {} = cmsMetainfo(projectsMetainfoSchema, (database) => {
//   return {
//     categories: getDatabasePropertySelectOptions("Category", database),
//     tags: getDatabasePropertySelectOptions("Tags", database),
//   };
// });

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  imageUrls: z.array(z.string().url()),
  codeLink: z.string().url().optional(),
  demoLink: z.string().url().optional(),
  forWhom: selectSchema,
  tags: multiSelectSchema,
  published: publishedStateSchema("PUBLISHED"),
});
export type Project = z.infer<typeof projectSchema>;

export const { getPages } = cmsPage(projectSchema, (page) => {
  return {
    id: page.id,
    title: getTitle(page),
    imageUrls: getFileUrls("Bilder", page)?.map((_, index) =>
      imageUrlBuilder({
        type: "page-property",
        pageId: page.id,
        property: "Bilder",
        index,
      })
    ),
    date: getDate("Dato", page),
    codeLink: getUrl("Kode", page),
    demoLink: getUrl("Link", page),
    tags: getMultiSelectAndColor("Tags", page),
    forWhom: getSelectAndColor("For hvem", page),
    published: getSelect("Published", page) as PublishedState | undefined,
  };
});