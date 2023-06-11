import { Client as NotionClient } from "@notionhq/client";
import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { TokenOrClient, tokenOrClientToClient } from "./utils";

/**
 * Creates a simplified client for fetching data from Notion
 * @param tokenOrClient a NotionClient or a Notion API token
 */
export const getClient = (tokenOrClient: TokenOrClient) => {
  const notionClient = tokenOrClientToClient(tokenOrClient);

  return {
    getDatabasePages: getDatabasePages(notionClient),
    getPage: getPage(notionClient),
    getDatabase: getDatabase(notionClient),
    getBlocks: getBlocks(notionClient),
    getBlocksWithChildren: getBlocksWithChildren(notionClient),
  };
};

type Sorts = Parameters<NotionClient["databases"]["query"]>[number]["sorts"];
type Filter = Parameters<NotionClient["databases"]["query"]>[number]["filter"];
export const getDatabasePages =
  (notion: NotionClient) =>
  async (
    databaseId: string,
    {
      sorts,
      filter,
    }: {
      sorts?: Sorts;
      filter?: Filter;
    } = {}
  ) => {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts,
      filter,
    });

    return response.results.filter(isPageObjectResponse);
  };

export const getPage = (notion: NotionClient) => async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return assertPageObjectResponse(response);
};

export const getDatabase =
  (notion: NotionClient) => async (databaseId: string) => {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    return assertDatabaseObjectResponse(response);
  };

/**
 * Fetches all blocks for a given block id
 */
export const getBlocks = (notion: NotionClient) => async (blockId: string) => {
  const blocks: (PartialBlockObjectResponse | BlockObjectResponse)[] = [];
  let cursor: string | undefined;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks.filter(isBlockObjectResponse);
};

export const getBlocksWithChildren =
  (notion: NotionClient) =>
  async (blockId: string): Promise<BlockWithChildren[]> => {
    const blocks = await getBlocks(notion)(blockId);
    // Retrieve block children for nested blocks (one level deep), for example toggle blocks
    // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
    const childBlocks = await Promise.all(
      blocks
        .filter((block) => block.has_children)
        .map(async (block) => {
          return {
            id: block.id,
            children: await getBlocksWithChildren(notion)(block.id),
          };
        })
    );

    // Merge
    const blocksWithChildren = blocks.map((block) => {
      const innerBlock = block as Record<string, any>;
      // Add child blocks if the block should contain children but none exists
      if (innerBlock.has_children && !innerBlock[innerBlock.type].children) {
        innerBlock[innerBlock.type]["children"] = childBlocks.find(
          (x) => x.id === innerBlock.id
        )?.children;
      }
      return innerBlock;
    }) as BlockWithChildren[];

    return blocksWithChildren;
  };

const isBlockObjectResponse = (
  block: PartialBlockObjectResponse | BlockObjectResponse
): block is BlockObjectResponse => "type" in block;

export type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren;
};

const isPageObjectResponse = (
  page: PageObjectResponse | PartialPageObjectResponse
): page is PageObjectResponse => "properties" in page;

const assertPageObjectResponse = (
  page: PartialPageObjectResponse | PageObjectResponse
) => {
  if ("properties" in page) return page;
  throw new Error("passed page is not a PageResponse");
};

const assertDatabaseObjectResponse = (
  database: PartialDatabaseObjectResponse | DatabaseObjectResponse
) => {
  if ("title" in database) return database;
  throw new Error("passed database is not a DatabaseResponse");
};
