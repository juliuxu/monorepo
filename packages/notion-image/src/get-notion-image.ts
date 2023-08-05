import type { ImageRequest } from "./schema";
import { imageRequestSchema } from "./schema";

import { tokenOrClientToClient, type TokenOrClient } from "./utils";

/**
 * Gets the url for an image on notion from the notion api
 */
export const getNotionImageUrl =
  (notionTokenOrClient: TokenOrClient) =>
  async (imageRequest: ImageRequest) => {
    const notionClient = tokenOrClientToClient(notionTokenOrClient);
    switch (imageRequest.type) {
      case "image-block":
        const block = await notionClient.blocks.retrieve({
          block_id: imageRequest.blockId,
        });
        if ("type" in block && block.type === "image") {
          return block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;
        }
        throw new Error("Block not an image");

      case "page-cover":
        const pageForCover = await notionClient.pages.retrieve({
          page_id: imageRequest.pageId,
        });
        if ("cover" in pageForCover && pageForCover.cover) {
          return pageForCover.cover.type === "external"
            ? pageForCover.cover.external.url
            : pageForCover.cover.file.url;
        }
        throw new Error("Cover not an image");

      case "page-property":
        const pageForProperty = await notionClient.pages.retrieve({
          page_id: imageRequest.pageId,

          // TODO: This is not working
          // I got `The schema for this database is malformed` when I tried using
          // I might be doing something wrong
          // filter_properties: [imageRequest.property],
        });
        const property =
          "properties" in pageForProperty &&
          pageForProperty.properties[imageRequest.property];
        if (
          property &&
          property.type === "files" &&
          property.files[imageRequest.index ?? 0].type !== undefined
        ) {
          const file = property.files[imageRequest.index ?? 0];
          if (file.type === "external") return file.external.url;
          else if (file.type === "file") return file.file.url;
        }
        throw new Error("Property not an image");
    }
  };

/**
 * Fetches an image from notion and returns the response as is
 */
export const getNotionImage =
  (notionTokenOrNotionClient: TokenOrClient) =>
  async (maybeImageRequest: {}) => {
    const imageRequest = imageRequestSchema.parse(maybeImageRequest);
    const imageUrl = await getNotionImageUrl(notionTokenOrNotionClient)(
      imageRequest
    );
    // @ts-ignore
    return await fetch(imageUrl);
  };
