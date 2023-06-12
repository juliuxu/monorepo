import { z } from "zod";

// ENV
const envVariables = z.object({
  NOTION_TOKEN: z.string().nonempty(),
});
envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

export const config = {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  notionToken: process.env.NOTION_TOKEN ?? "",

  landingPageId: "eb763c82093c48d1955de8cc4ea450cb",
  notionDrivenPagesDatabaseId: "f61d11c80e4b40e2a4329cde350bb31a",
  todayILearnedDatabaseId: "2114376d77f34c0390d81fa606a43fbb",
};
