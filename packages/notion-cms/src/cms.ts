import {
  type Client,
  type GetDatabasePagesOptions,
} from "@julianjark/notion-client";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  BlockObjectResponse,
} from "@julianjark/notion-utils";
import { z } from "zod";
import { chunked, type Relaxed } from "./misc";
import { safeParseList } from "./safe-parse";

// TODO: Find an ergonomic way to pass this to the abstraction

export function cmsMetainfo<Metainfo extends z.Schema>(
  metainfoSchema: Metainfo,
  metainfoMapper: (
    fromDatabase: DatabaseObjectResponse
  ) => Relaxed<z.infer<Metainfo>>
) {
  return {
    getMetainfo:
      (client: Client) =>
      async (databaseId: string): Promise<z.infer<Metainfo>> => {
        const database = await client.getDatabase(databaseId);
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
    getPage:
      (client: Client) =>
      async (pageId: string): Promise<z.infer<HeadSchema>> => {
        const page = await client.getPage(pageId);
        return pageSchema.parse(pageToHeadMapper(page));
      },
    getPages:
      (client: Client) =>
      async (databaseId: string, options: GetDatabasePagesOptions = {}) => {
        const pages = await client.getDatabasePages(databaseId, options);
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
    getBodyFromHead:
      (client: Client) =>
      async <Head extends { id: string }>(
        head: Head
      ): Promise<Head & z.infer<BodySchema>> => {
        const blocks = await client.getBlocksWithChildren(head.id);
        return {
          ...head,
          ...bodySchema.parse(await blocksToBodyMapper(blocks)),
        };
      },

    /**
     * Return a safe parsed list of heads and bodies
     * based on a given list of heads.
     */
    getHeadAndBodyListFromHeads:
      (client: Client) =>
      async <Head extends { id: string }>(heads: Head[]) => {
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
              blocks: await client.getBlocksWithChildren(head.id),
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
