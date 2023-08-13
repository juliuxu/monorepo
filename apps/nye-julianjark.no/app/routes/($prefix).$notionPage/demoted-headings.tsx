import type { Components } from "@julianjark/notion-render";
import { H1, H2, H3 } from "@julianjark/notion-render";
import { getTextFromRichText, slugify } from "@julianjark/notion-utils";

export const demotedHeadings: Partial<Components> = {
  heading_1: (props) => (
    <H1
      {...props}
      as="h2"
      // @ts-ignore
      id={
        props.block.type === "heading_1"
          ? slugify(getTextFromRichText(props.block.heading_1.rich_text))
          : ""
      }
    />
  ),
  heading_2: (props) => (
    <H2
      {...props}
      as="h3"
      // @ts-ignore
      id={
        props.block.type === "heading_2"
          ? slugify(getTextFromRichText(props.block.heading_2.rich_text))
          : ""
      }
    />
  ),
  heading_3: (props) => (
    <H3
      {...props}
      as="h4"
      // @ts-ignore
      id={
        props.block.type === "heading_3"
          ? slugify(getTextFromRichText(props.block.heading_3.rich_text))
          : ""
      }
    />
  ),
};
