import type { ImageRequest } from "./schema";

/**
 * Use this to create a url to our server that will fetch the image from notion
 */
export const createImageUrlBuilder =
  (apiPath: string) => (imageRequest: ImageRequest) =>
    `${apiPath}?${new URLSearchParams(imageRequest as Record<string, string>)}`;
// https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
