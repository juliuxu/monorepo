import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const getTitle = (fromPage: PageObjectResponse) => {
  const title = Object.values(fromPage.properties).find(
    (property) => property.type === "title"
  );
  if (title?.type !== "title")
    throw new Error("Could not get title from passed notion page");

  return getTextFromRichText(title.title).trim();
};

export const getBoolean = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "checkbox") {
    return property.checkbox;
  }
  return undefined;
};

export const getUrl = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "url") {
    return property.url ?? undefined;
  }
  return undefined;
};

export const getFileUrl = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "files") {
    if (property.files.length === 0) return undefined;

    const file = property.files[0];
    if (file?.type === "external") {
      return file.external.url;
    } else if (file.type === "file") {
      return file.file.url;
    }
  }
  return undefined;
};

export const getRichText = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "rich_text") {
    return property.rich_text;
  }
  return undefined;
};

export const getText = (name: string, fromPage: PageObjectResponse) => {
  const richText = getRichText(name, fromPage);
  if (richText) return getTextFromRichText(richText);
  return undefined;
};

export const getEmail = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "email") {
    return property.email ?? undefined;
  }
  return undefined;
};

export const getRelation = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "relation") {
    return property.relation.map((x) => x.id);
  }
  return undefined;
};

export const getDate = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "date") {
    return property.date?.start ?? undefined;
  }
  return undefined;
};

export const getImage = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "files") {
    return property.files
      .map((it) =>
        it.type === "external"
          ? it.external.url
          : it.type === "file"
          ? it.file.url
          : undefined
      )
      .find((it) => !!it?.length);
  }
  return undefined;
};

export const getDateRange = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "date") {
    return property.date;
  }
  return undefined;
};

export const getCheckbox = (name: string, fromPage: PageObjectResponse) => {
  const property = fromPage.properties[name];
  if (property?.type === "checkbox") {
    return property.checkbox;
  }
  return undefined;
};

export const getSelectAndColor = (
  name: string,
  fromPage: PageObjectResponse
) => {
  const property = fromPage.properties[name];
  if (
    property?.type === "select" &&
    property.select?.name &&
    property.select.color
  ) {
    return {
      id: property.select.id,
      title: property.select.name,
      color: property.select.color,
    };
  }
  return undefined;
};

export const getSelect = (name: string, fromPage: PageObjectResponse) =>
  getSelectAndColor(name, fromPage)?.title;

export const getMultiSelectAndColor = (
  name: string,
  fromPage: PageObjectResponse
) => {
  const property = fromPage.properties[name];
  if (property?.type === "multi_select") {
    return property.multi_select.map((x) => ({
      id: x.id,
      title: x.name,
      color: x.color,
    }));
  }
  return undefined;
};

export const getMultiSelect = (name: string, fromPage: PageObjectResponse) =>
  getMultiSelectAndColor(name, fromPage)?.map((x) => x.title);

export const getTextFromRichText = (richText: RichTextItem[]) =>
  richText.map((richTextBlock) => richTextBlock.plain_text).join("");

export const getDatabasePropertySelectOptions = (
  name: string,
  fromDatabase: DatabaseObjectResponse
) => {
  const property = fromDatabase.properties[name];
  if (property?.type === "select") {
    return property.select.options.map((x) => ({
      id: x.id,
      color: x.color,
      title: x.name,
    }));
  }

  return undefined;
};

// Some typescript magic to extract the correct types
export type RichText = Extract<
  BlockObjectResponse,
  { type: "heading_1" }
>["heading_1"];
export type RichTextItem = Extract<
  BlockObjectResponse,
  { type: "paragraph" }
>["paragraph"]["rich_text"][number];

export type RichTextColor = RichTextItem["annotations"]["color"];
export type SelectColor = NonNullable<
  Extract<
    PageObjectResponse["properties"][string],
    { type: "select" }
  >["select"]
>["color"];
