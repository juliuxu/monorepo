import type { GetDatabasePagesOptions } from "@julianjark/notion-client";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  BlockObjectResponse,
} from "@julianjark/notion-utils";
import { z } from "zod";
import { notionClient } from "~/clients.server";
import { chunked, type Relaxed } from "~/misc";
import { safeParseList } from "./parse";

// TODO: Find an ergonomic way to pass this to the abstraction

export function cmsMetainfo<Metainfo extends z.Schema>(
  metainfoSchema: Metainfo,
  metainfoMapper: (
    fromDatabase: DatabaseObjectResponse
  ) => Relaxed<z.infer<Metainfo>>
) {
  return {
    getMetainfo: async (databaseId: string): Promise<z.infer<Metainfo>> => {
      const database = await notionClient.getDatabase(databaseId);
      return metainfoSchema.parse(metainfoMapper(database));
    },
  };
}

export function cmsPage<HeadSchema extends z.Schema>(
  pageSchema: HeadSchema,
  pageToHeadMapper: (
    fromPage: PageObjectResponse
  ) => Relaxed<z.infer<HeadSchema>>
) {
  return {
    getPages: async (databaseId: string, options: GetDatabasePagesOptions) => {
      const pages = await notionClient.getDatabasePages(databaseId, options);
      return await safeParseList(pages, pageSchema, pageToHeadMapper);
    },
  };
}

export function cmsBlocks<BodySchema extends z.Schema>(
  bodySchema: BodySchema,
  blocksToBodyMapper: (
    fromBlocks: BlockObjectResponse[]
  ) => Relaxed<z.infer<BodySchema>> | Promise<Relaxed<z.infer<BodySchema>>>
) {
  return {
    getBodyFromHead: async <Head extends { id: string }>(
      head: Head
    ): Promise<Head & z.infer<BodySchema>> => {
      const blocks = await notionClient.getBlocksWithChildren(head.id);
      return { ...head, ...bodySchema.parse(await blocksToBodyMapper(blocks)) };
    },

    /**
     * Return a safe parsed list of heads and bodies
     * based on a given list of heads.
     */
    getHeadAndBodyListFromHeads: async <Head extends { id: string }>(
      heads: Head[]
    ) => {
      // Chunked fetching
      // TODO: Handle rate-limiting
      const blocksWithHead: {
        head: Head;
        blocks: BlockObjectResponse[];
      }[] = [];
      for (const chunk of chunked(heads, 5)) {
        const fetchedBlocksWithHead = await Promise.all(
          chunk.map(async (head) => ({
            head,
            blocks: await notionClient.getBlocksWithChildren(head.id),
          }))
        );
        blocksWithHead.push(...fetchedBlocksWithHead);
      }
      const schema = z.custom<Head>().and(bodySchema);
      return await safeParseList(
        blocksWithHead,
        schema,
        async ({ head, blocks }) => ({
          ...head,
          ...(await blocksToBodyMapper(blocks)),
        })
      );
    },
  };
}
