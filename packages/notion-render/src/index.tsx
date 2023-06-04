import { useContext } from "react";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import type { Classes } from "./classes";
import { EmptyClasses } from "./classes";
import type { Components, ExtendedBlock } from "./components";
import { DefaultComponents } from "./components";
import NotionRenderContext from "./context";
import type { ListBlock } from "./pseudo-components";

const filterUnsupportedBlocks = (
  components: Components,
  blocks: BlockObjectResponse[]
) => blocks.filter((block) => components[block.type] !== undefined);

export const renderBlock = (components: Components, block: ExtendedBlock) => {
  const Component = components[block.type];
  if (Component === undefined) return undefined;
  return <Component key={block.id} block={block} />;
};

// Handle bulleted_list_item and numbered_list_item
// by grouping them into bulleted_list and numbered_list pseudo blocks
const extendBlocks = (blocks: BlockObjectResponse[]): ExtendedBlock[] =>
  blocks.reduce((acc, block, index) => {
    if (block.type === "bulleted_list_item") {
      const previousBlock = acc[acc.length - 1];
      if (previousBlock?.type === "bulleted_list") {
        previousBlock.children.push(block);
      } else {
        const listBlock: ListBlock = {
          id: `${index}`,
          type: "bulleted_list",
          children: [],
        };
        listBlock.children.push(block);
        acc.push(listBlock);
      }
    } else if (block.type === "numbered_list_item") {
      const previousBlock = acc[acc.length - 1];
      if (previousBlock?.type === "numbered_list") {
        previousBlock.children.push(block);
      } else {
        const listBlock: ListBlock = {
          id: `${index}`,
          type: "numbered_list",
          children: [],
        };
        listBlock.children.push(block);
        acc.push(listBlock);
      }
    } else {
      acc.push(block);
    }
    return acc;
  }, [] as ExtendedBlock[]);

interface NotionRenderProps {
  blocks: BlockObjectResponse[];
  classes?: Partial<Classes>;
  components?: Partial<Components>;
}

/**
 * Render a set of notion blocks
 * configure by passing a classes and/or components mapping
 *
 * by default most blocks are rendered as pure html elements
 */
export default function NotionRender({
  blocks,
  classes,
  components,
}: NotionRenderProps) {
  const context = useContext(NotionRenderContext);

  const finalClasses = { ...EmptyClasses, ...context?.classes, ...classes };
  const finalComponents = {
    ...DefaultComponents,
    ...context?.components,
    ...components,
  };

  const supportedBlocks = filterUnsupportedBlocks(finalComponents, blocks);
  const extendedBlocks = extendBlocks(supportedBlocks);
  const renderBlocks = extendedBlocks.map((block) =>
    renderBlock(finalComponents, block)
  );
  if (context === undefined) {
    return (
      <NotionRenderContext.Provider
        value={{ classes: finalClasses, components: finalComponents }}
      >
        {renderBlocks}
      </NotionRenderContext.Provider>
    );
  }
  return <>{renderBlocks}</>;
}
