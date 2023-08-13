import { LRUCache } from "lru-cache";
import memoizeFs from "memoize-fs";
import { join as pathJoin } from "path";

import { getClient } from "./client";
import type { TokenOrClient } from "./utils";

type CacheArgs = {
  method: keyof ReturnType<typeof getClient>;
  args: any;
};

const defaultLruOptions = {
  max: 1000,
  ttl: 1000 * 60,
  allowStale: true,
  allowStaleOnFetchRejection: true,
  allowStaleOnFetchAbort: true,
  noDeleteOnFetchRejection: true,
};

interface GetClientCachedProps {
  tokenOrClient: TokenOrClient;
  lruOptions?: {};
  saveToDisk?: boolean;
  saveToDiskPath?: string;
}

/**
 * Create a cached version of the Notion client
 * using in-memory lru-cache with stale-while-revalidate
 *
 * Use this if you use these fetcher methods directly
 * If you are building your own domain model on top of this
 * you should cache the results there instead
 */
export const getClientCached = ({
  tokenOrClient,
  lruOptions = {},
  saveToDisk = false,
  saveToDiskPath,
}: GetClientCachedProps): ReturnType<typeof getClient> & {
  cache: LRUCache<string, any>;
  clearCache: () => void;
} => {
  const client = getClient(tokenOrClient);

  let fetchMethod = async (argsAsJson: string) => {
    const { method, args } = JSON.parse(argsAsJson) as CacheArgs;
    try {
      return await (client[method] as Function)(...args);
    } catch (e) {
      console.error(`getClientCached(${method}): ❌ failed fetching`, e);
      throw e;
    }
  };

  let memoizeFsClear: () => void;
  if (saveToDisk) {
    const memoizer = memoizeFs({
      cachePath:
        saveToDiskPath ??
        pathJoin(process.cwd(), ".cache", "notion-utils-cache"),
    });
    memoizeFsClear = memoizer.invalidate;
    const p = memoizer.fn(fetchMethod, {});
    let mfn: any = undefined;
    fetchMethod = async (...args: any) => {
      if (!mfn) {
        mfn = await p;
      }
      return await mfn(...args);
    };
  }

  const cache = new LRUCache<string, any>({
    ...defaultLruOptions,
    ...lruOptions,
    fetchMethod,
  });

  return {
    cache,
    clearCache: () => {
      cache.clear();
      memoizeFsClear?.();
    },
    getBlocks: async (...args) =>
      (await cache.fetch(
        JSON.stringify({ method: "getBlocks", args } satisfies CacheArgs),
      ))!,
    getBlocksWithChildren: async (...args) =>
      (await cache.fetch(
        JSON.stringify({
          method: "getBlocksWithChildren",
          args,
        } satisfies CacheArgs),
      ))!,
    getDatabase: async (...args) =>
      (await cache.fetch(
        JSON.stringify({
          method: "getDatabase",
          args,
        } satisfies CacheArgs),
      ))!,
    getDatabasePages: async (...args) =>
      (await cache.fetch(
        JSON.stringify({
          method: "getDatabasePages",
          args,
        } satisfies CacheArgs),
      ))!,
    getPage: async (...args) =>
      (await cache.fetch(
        JSON.stringify({
          method: "getPage",
          args,
        } satisfies CacheArgs),
      ))!,
  };
};
