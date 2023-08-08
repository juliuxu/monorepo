import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { BlockComponentProps } from "./components";
import { DefaultComponents } from "./components";
import { useNotionRenderContext as ctx } from "./context";

// Pseudo blocks
export interface ListBlock {
  id: string;
  type: "bulleted_list" | "numbered_list";
  children: BlockObjectResponse[];
}
export type ListBlockType = ListBlock["type"];

// Two pseudo blocks to handle list items
export const BulletedList = ({ block }: BlockComponentProps) => {
  if (block.type !== "bulleted_list") return null;
  return (
    <ul className={ctx().classes.bulleted_list.root}>
      {block.children.map((block) => {
        const Component = DefaultComponents[block.type];
        if (Component === undefined) return undefined;
        return <Component key={block.id} block={block} />;
      })}
    </ul>
  );
};
export const NumberedList = ({ block }: BlockComponentProps) => {
  if (block.type !== "numbered_list") return null;
  return (
    <ol className={ctx().classes.numbered_list.root}>
      {block.children.map((block) => {
        const Component = DefaultComponents[block.type];
        if (Component === undefined) return undefined;
        return <Component key={block.id} block={block} />;
      })}
    </ol>
  );
};
