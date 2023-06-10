import { z } from "zod";
import { getDatabasePages } from "../../notion-utils/src/client";
import { getTitle, getFileUrl, getText } from "../../notion-utils/src/helpers";
import { createImageUrlBuilder } from "./helpers";
import { tokenOrClientToClient, type TokenOrClient } from "./utils";

const imageAssetSchema = z.object({
  src: z.string(),
  alt: z.string(),

  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
});
type ImageAsset = z.infer<typeof imageAssetSchema>;

export interface GetImageAssetsConfig {
  databaseId: string;
  titleProperty: string;
  srcProperty: string;
  altProperty: string;
  widthProperty?: string;
  heightProperty?: string;
}
export const createGetImageAssets =
  ({
    apiPath,
    notionTokenOrClient,
  }: {
    apiPath: string;
    notionTokenOrClient: TokenOrClient;
  }) =>
  async <ImageName extends string>(
    names: ImageName[],
    config: GetImageAssetsConfig
  ) => {
    const assets = await getDatabasePages(
      tokenOrClientToClient(notionTokenOrClient)
    )(config.databaseId, {
      filter: {
        or: names.map((name) => ({
          property: config.titleProperty,
          title: {
            equals: name,
          },
        })),
      },
    });

    const imageUrlBuilder = createImageUrlBuilder(apiPath);
    const images = assets.reduce((acc, asset) => {
      const name = getTitle(asset) as ImageName;

      acc[name] = imageAssetSchema.parse({
        src:
          // Make sure the property is set
          getFileUrl(config.srcProperty, asset) &&
          // Then create the proxied url
          imageUrlBuilder({
            type: "page-property",
            pageId: asset.id,
            property: config.srcProperty,
          }),

        alt: getText(config.altProperty, asset),
        width: config.widthProperty
          ? getText(config.widthProperty, asset)
          : undefined,
        height: config.heightProperty
          ? getText(config.heightProperty, asset)
          : undefined,
      });
      return acc;
    }, {} as Record<ImageName, ImageAsset>);
    assertContainsItems(names, images);

    return images;
  };

function assertContainsItems<K extends string, V, T extends K>(
  properties: readonly T[],
  record: Record<K, V> | Record<T, V>
): asserts record is Record<T, V> {
  const s = new Set(properties);
  Object.keys(record).forEach((key) => {
    if (!s.has(key as any)) {
      throw new Error(`${key} is missing`);
    }
  });
}
