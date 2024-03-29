import type { Theme as ShikiTheme } from "shiki";
import { z } from "zod";

// ENV
const envVariables = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
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
  nodeEnv: process.env.NODE_ENV ?? "production",
  notionToken: process.env.NOTION_TOKEN ?? "",
  previewSecret: process.env.PREVIEW_SECRET ?? "",

  landingPageId: "eb763c82093c48d1955de8cc4ea450cb",
  notionDrivenPagesDatabaseId: "f61d11c80e4b40e2a4329cde350bb31a",
  todayILearnedDatabaseId: "2114376d77f34c0390d81fa606a43fbb",
  projectsDatabaseId: "dfaf2149fb924749a37a6ba893758f5c",
  featuredProject: "4467b15b23514e159171f1ef3f6d0b4a",
  detteKanJegDatabaseId: "341990326a304652869c0c599faabe97",

  /**
   * Cache loader in the client to support prefetching
   * but don't use stale-while-revalidate, this can cause inconsistensies when new code is deployed
   * If the response errors, say if the server has crashed, then it does not hurt to use stale data
   *
   * For html responses stale-while-revalidate for a long time is fine, we want really fast initial loads,
   * for more control we could choose to only cache the most common pages
   * Having a year as stale-while-revalidate time I think is a good tradeoff for this app.
   */
  loaderCacheControlHeaders: {
    "Cache-Control": `public, max-age=${60}, s-maxage=${1}, stale-if-error=${WEEK_IN_SECONDS}`,
  },
  htmlCacheControlHeaders: {
    "Cache-Control": `public, max-age=${60}, must-revalidate, s-maxage=${1}, stale-while-revalidate=${YEAR_IN_SECONDS}`,
  },

  shikiTheme: "dracula-soft" satisfies ShikiTheme,
} as const;
