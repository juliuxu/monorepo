import type { RichTextItem } from "@julianjark/notion-utils";
import { useNotionRenderContext as ctx } from "./context";

interface RichTextProps {
  richText: RichTextItem;
}
export const RichText = ({ richText }: RichTextProps) => {
  if (richText.type === "equation") return null;

  const classes = ctx().classes;
  const color = classes[`color_${richText.annotations.color}`];

  let element: JSX.Element;
  element = <span className={color}>{richText.plain_text}</span>;

  if (richText.annotations.bold) {
    element = (
      <strong className={color + " " + classes.annotation_bold}>
        {richText.plain_text}
      </strong>
    );
  } else if (richText.annotations.code) {
    element = (
      <code className={color + " " + classes.annotation_code}>
        {richText.plain_text}
      </code>
    );
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

  // TODO: Link style
  if (richText.href !== null) {
    element = <a href={richText.href}>{element}</a>;
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
