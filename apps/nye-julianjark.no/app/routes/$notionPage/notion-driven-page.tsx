import type { Components, Classes } from "@julianjark/notion-render";
import {
  useNotionRenderContext,
  RichTextAnchor,
  RichTextListRender,
  NotionRender,
} from "@julianjark/notion-render";
import { Link } from "@remix-run/react";
import { UnpicNotionImage } from "~/components/unpic-notion-image";
import type { NotionDrivenPage } from "./schema-and-mapper";
import {
  NotionShikiCode,
  NotionShikiCodeRichText,
} from "@julianjark/notion-shiki-code";
import { classNames } from "~/misc";
import { CustomBlock } from "./custom-blocks";
import { demotedHeadings } from "./demoted-headings";
import { Header } from "~/components/header";

export const components: Partial<Components> = {
  image: UnpicNotionImage,

  code: ({ block }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useNotionRenderContext();
    return (
      <NotionShikiCode
        block={block}
        className={classNames(
          ctx.classes.code.root,
          // Copy button border
          "[&_button:hover]:border-white [&_button]:rounded-md [&_button]:border [&_button]:border-gray-400 [&_button]:bg-[--shiki-background] [&_button]:p-1.5",

          // Copy button opacity on hover
          "[&:active_button]:opacity-100 [&:hover_button]:opacity-100 [&_button]:opacity-0 [&_button]:transition-opacity",

          // Line highlightning
          "[&_.highlight]:after:absolute [&_.highlight]:after:left-0 [&_.highlight]:after:h-[1.5rem] [&_.highlight]:after:w-full [&_.highlight]:after:bg-teal-500 [&_.highlight]:after:opacity-20 [&_.highlight]:after:content-['_']",
          "[&_.highlight]:after:pointer-events-none"
        )}
      />
    );
  },
  rich_text_code: NotionShikiCodeRichText,

  callout: CustomBlock,

  rich_text_anchor: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useNotionRenderContext();
    const url = new URL(props.richText.href);
    if (url.hostname === "julianjark.no") {
      return (
        <Link
          prefetch="viewport"
          to={url.pathname + url.search}
          className={ctx.classes.rich_text_anchor}
        >
          {props.children}
        </Link>
      );
    }
    return <RichTextAnchor {...props} />;
  },
};

export const classes /*tw*/ = {
  heading_1: { root: "text-h1 lg:text-h1-lg" },
  heading_2: { root: "text-h2 lg:text-h2-lg" },
  heading_3: { root: "text-h3 lg:text-h3-lg" },
  rich_text_anchor:
    "underline focus:text-primary-focus hover:text-primary-focus break-words",
  column_list: {
    root: classNames(
      "mt-6 gap-x-[5vw] gap-y-[5vw] grid sm:grid-cols-12",
      "[&>*:first-child]:col-span-5 [&>*:nth-child(2)]:col-span-7",
      "[.column-layout-7-5_&>*:first-child]:col-span-7 [.column-layout-7-5_&>*:nth-child(2)]:col-span-5",
      "[.column-layout-6-6_&>*:first-child]:col-span-6 [.column-layout-6-6_&>*:nth-child(2)]:col-span-6",

      // Reverse even column lists
      "ndp-column-list",
      "[.column-layout-reverse-even_&:nth-child(even_of_.ndp-column-list)>*:first-child]:order-2",
      "[.column-layout-reverse-even_&:nth-child(even_of_.ndp-column-list)>*:nth-child(2)]:order-1"
    ),
  },
  column: {
    root: "gap-1 md:gap-2 flex flex-col justify-center md:justify-start sm:[&_img]:max-w-lg",
  },
  divider: { root: "mt-[6vw] mb-[6vw] border-t-2 border-black" },
  color_orange: "text-secondary",
  paragraph: { root: "max-w-4xl whitespace-pre-wrap" },
  toggle: { root: "bg-primary" },
} satisfies Partial<Classes>;

interface NotionPageProps {
  page: NotionDrivenPage;
}
export function NotionPage({ page }: NotionPageProps) {
  const shouldDemote = page.blocks.some((block) => block.type === "heading_1");

  return (
    <main>
      <Header
        title={page.title}
        description={
          <RichTextListRender richTextList={page.preamble} classes={classes} />
        }
      />
      <div className={`mt-[12vw] md:mt-[6vw] ${page.options.join(" ")}`}>
        <NotionRender
          blocks={page.blocks}
          components={{
            ...components,
            ...(shouldDemote ? demotedHeadings : {}),
          }}
          classes={classes}
        />
      </div>
    </main>
  );
}
