import type { Components, Classes } from "@julianjark/notion-render";
import {
  useNotionRenderContext,
  RichTextAnchor,
  RichTextListRender,
  NotionRender,
} from "@julianjark/notion-render";
import { getTextFromRichText } from "@julianjark/notion-utils";
import { Link } from "@remix-run/react";
import { UnpicNotionImage } from "~/components/unpic-notion-image";
import { LatestTodayILearnedEntries } from "../_index/latest-today-i-learned-entries";
import type { NotionDrivenPage } from "./schema-and-mapper";
import {
  NotionShikiCode,
  NotionShikiCodeRichText,
} from "@julianjark/notion-shiki-code";
import { classNames } from "~/misc";

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
          "[&_button:hover]:border-white [&_button]:rounded-md [&_button]:border [&_button]:p-1.5",

          // Copy button opacity on hover
          "[&:active_button]:opacity-100 [&:hover_button]:opacity-100 [&_button]:opacity-0 [&_button]:transition-opacity",

          // Line highlightning
          "[&_.highlight]:after:absolute [&_.highlight]:after:left-0 [&_.highlight]:after:h-[2rem] [&_.highlight]:after:w-full [&_.highlight]:after:bg-teal-500 [&_.highlight]:after:opacity-20 [&_.highlight]:after:content-['_']"
        )}
      />
    );
  },
  rich_text_code: NotionShikiCodeRichText,

  callout: ({ block }) => {
    if (block.type !== "callout") return null;
    const name = getTextFromRichText(block.callout.rich_text).trim();

    if (name === "BLOCK_REPLACE_TODAY_I_LEARNED_LATEST") {
      return <LatestTodayILearnedEntries />;
    }
    return null;
  },
  rich_text_anchor: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useNotionRenderContext();
    const url = new URL(props.richText.href);
    if (url.hostname === "julianjark.no") {
      return (
        <Link
          prefetch="intent"
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
  heading_2: { root: "" },
  rich_text_anchor:
    "underline focus:text-primary-focus hover:text-primary-focus break-words",
  column_list: {
    root: "gap-x-[5vw] gap-y-[5vw] grid sm:grid-cols-12 [&>*:first-child]:col-span-5 [&>*:nth-child(2)]:col-span-7",
  },
  column: {
    root: "gap-1 md:gap-2 flex flex-col justify-center md:justify-start sm:[&_img]:max-w-lg",
  },
  divider: { root: "mt-[6vw] mb-[6vw] border-t-2 border-black" },
  color_orange: "text-secondary",
  paragraph: { root: "max-w-4xl" },
  toggle: { root: "bg-primary" },
} satisfies Partial<Classes>;

interface NotionPageProps {
  page: NotionDrivenPage;

  headerClassName?: string;
  mainClassName?: string;
}
export function NotionPage({
  page,
  headerClassName,
  mainClassName,
}: NotionPageProps) {
  return (
    <div>
      <Header
        title={page.title}
        description={
          <RichTextListRender richTextList={page.preamble} classes={classes} />
        }
        className={headerClassName}
      />
      {/* <details>
        <summary>Debug</summary>
        <pre>{JSON.stringify(data.latestTodayILearnedEntries, null, 2)}</pre>
      </details> */}
      <main
        className={`mt-[12vw] md:mt-[6vw] ${
          mainClassName ? mainClassName : ""
        }`}
      >
        <NotionRender
          blocks={page.blocks}
          components={components}
          classes={classes}
        />
      </main>
    </div>
  );
}

export function Header({
  title,
  description,
  className,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`pt-[4vw] ${className ? className : ""}`}>
      <h1 className="text-6xl font-bold">{title}</h1>
      <p className="mt-4 max-w-4xl text-3xl">{description}</p>
    </header>
  );
}
