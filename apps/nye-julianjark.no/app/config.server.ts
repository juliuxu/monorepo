import type { Theme as ShikiTheme } from "shiki";
import { z } from "zod";

// ENV
const envVariables = z.object({
  NOTION_TOKEN: z.string().nonempty(),
  PREVIEW_SECRET: z.string().nonempty(),
});
envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
export const config = {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  notionToken: process.env.NOTION_TOKEN ?? "",
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  previewSecret: process.env.PREVIEW_SECRET ?? "",

  landingPageId: "eb763c82093c48d1955de8cc4ea450cb",
  notionDrivenPagesDatabaseId: "f61d11c80e4b40e2a4329cde350bb31a",
  todayILearnedDatabaseId: "2114376d77f34c0390d81fa606a43fbb",

  /**
   * Cache loader in the client to support prefetching
   * but don't use stale-while-revalidate, this can cause inconsistensies when new code is deployed
   * If the response errors, say if the server has crashed, then it does not hurt to use stale data
   *
   * For html responses stale-while-revalidate is fine, we want really first initial loads
   * for more control we could choose to only cache the most common pages
   * Having a week as stale-while-revalidate time I think is a good tradeoff for this app.
   */
  loaderCacheControlHeaders: {
    "Cache-Control": `public, max-age=${60}, s-maxage=${1}, stale-if-error=${YEAR_IN_SECONDS}`,
  },
  htmlCacheControlHeaders: {
    "Cache-Control": `public, max-age=${60}, must-revalidate, s-maxage=${1}, stale-while-revalidate=${WEEK_IN_SECONDS}`,
  },

  shikiTheme: "dark-plus" satisfies ShikiTheme,
} as const;
