import type { Client as NotionClient } from "@notionhq/client";
import { getDatabasePages } from "./client";
import { getTitle, getFileUrl, getText } from "./helpers";

export interface ImageAsset {
  src: string;
  alt: string;
}
export interface GetImageAssetsConfig {
  titleProperty: string;
  srcProperty: string;
  altProperty: string;
  databaseId: string;
}
export const getImageAssets =
  (client: NotionClient) =>
  async <ImageName extends string>(
    names: ImageName[],
    {
      titleProperty,
      srcProperty,
      altProperty,
      databaseId,
    }: GetImageAssetsConfig
  ) => {
    const assets = await getDatabasePages(client)(databaseId, {
      filter: {
        or: names.map((name) => ({
          property: titleProperty,
          title: {
            equals: name,
          },
        })),
      },
    });

    const images = assets.reduce((acc, asset) => {
      const name = getTitle(asset) as ImageName;
      const url = getFileUrl(srcProperty, asset);
      if (url === undefined)
        throw new Error(`no image resource for name ${name}`);

      const alt = getText(altProperty, asset);
      if (alt === undefined) throw new Error(`no alt for name ${name}`);

      acc[name] = { src: url, alt };
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
