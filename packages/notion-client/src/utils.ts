import { Client as NotionClient } from "@notionhq/client";

export type TokenOrClient = string | NotionClient;
export function tokenOrClientToClient(
  notionTokenOrNotionClient: TokenOrClient,
) {
  if (typeof notionTokenOrNotionClient === "string") {
    return new NotionClient({
      auth: notionTokenOrNotionClient,
    });
  }
  return notionTokenOrNotionClient;
}
