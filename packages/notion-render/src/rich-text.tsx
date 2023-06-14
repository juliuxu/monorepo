import type { RichTextItem } from "@julianjark/notion-utils";
import type { NotionRenderContextProps } from "./context";
import { NotionRenderContext, useNotionRenderContext as ctx } from "./context";

export interface RichTextAnchorProps {
  richText: RichTextItem & { href: string };
  children: React.ReactNode;
}
export const RichTextAnchor = ({ richText, children }: RichTextAnchorProps) => {
  return (
    <a href={richText.href} className={ctx().classes.rich_text_anchor}>
      {children}
    </a>
  );
};

export interface RichTextCodeProps {
  richText: RichTextItem;
}
export const RichTextCode = ({ richText }: RichTextCodeProps) => {
  const { classes } = ctx();
  const color = classes[`color_${richText.annotations.color}`];

  return (
    <code className={color + " " + classes.annotation_code}>
      {richText.plain_text}
    </code>
  );
};

interface RichTextProps {
  richText: RichTextItem;
}
export const RichText = ({ richText }: RichTextProps) => {
  if (richText.type === "equation") return null;

  const {
    classes,
    components: {
      rich_text_code: RichTextCodeComponent,
      rich_text_anchor: RichTextAnchorComponent,
    },
  } = ctx();
  const color = classes[`color_${richText.annotations.color}`];

  let element: JSX.Element;
  element = <span className={color}>{richText.plain_text}</span>;

  if (richText.annotations.bold) {
    element = (
      <strong className={color + " " + classes.annotation_bold}>
        {richText.plain_text}
      </strong>
    );
  } else if (richText.annotations.code && RichTextCodeComponent !== undefined) {
    element = <RichTextCodeComponent richText={richText} />;
  } else if (richText.annotations.italic) {
    element = (
      <em className={color + " " + classes.annotation_italic}>
        {richText.plain_text}
      </em>
    );
  } else if (richText.annotations.strikethrough) {
    element = (
      <s className={color + " " + classes.annotation_strikethrough}>
        {richText.plain_text}
      </s>
    );
  } else if (richText.annotations.underline) {
    element = (
      <u className={color + " " + classes.annotation_underline}>
        {richText.plain_text}
      </u>
    );
  }

  if (richText.href !== null && RichTextAnchorComponent !== undefined) {
    element = (
      <RichTextAnchorComponent
        richText={richText as RichTextItem & { href: string }}
      >
        {element}
      </RichTextAnchorComponent>
    );
  }
  return element;
};
interface RichTextListProps {
  richTextList: RichTextItem[];
}
export const RichTextList = ({ richTextList }: RichTextListProps) => {
  return (
    <>
      {richTextList.map((richText, index) => (
        <RichText key={index} richText={richText} />
      ))}
    </>
  );
};

interface RichTextListRenderProps
  extends Omit<NotionRenderContextProps, "children"> {
  richTextList: RichTextItem[];
}
export function RichTextListRender({
  richTextList,
  ...contextProps
}: RichTextListRenderProps) {
  return (
    <NotionRenderContext {...contextProps}>
      <RichTextList richTextList={richTextList} />
    </NotionRenderContext>
  );
}
