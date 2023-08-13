import type {
  BlockComponentProps,
  Classes,
  Components,
} from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";

import { PhotoSwipeImage } from "~/components/photoswipe-image";
import { UnpicNotionImage } from "~/components/unpic-notion-image";
import { useContentOnlyMode } from "~/content-only-mode";
import {
  classes,
  components,
} from "~/routes/($prefix).$notionPage/notion-driven-page";
import type { TodayILearnedEntry } from "~/service/notion-today-i-learned/schema-and-mapper";
import { classNames } from "~/utils/misc";
import { Badge } from "./badge";
import { dateFormatter } from "./date-formatter";

const todayILearnedComponents: Partial<Components> = {
  ...components,
  image: ({ block }: BlockComponentProps) => {
    return (
      <PhotoSwipeImage>
        {({ ref, onClick }) => (
          <UnpicNotionImage
            block={block}
            ref={ref}
            onClick={onClick}
            className="cursor-pointer"
          />
        )}
      </PhotoSwipeImage>
    );
  },
};
const todayILearnedClasses /*tw*/ = {
  ...classes,
  column_list: {
    root: classNames(
      "mt-[2em]",
      "grid gap-0 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-flow-col sm:auto-cols-fr",
      "[&>div:first-child>*:first-child]:mt-0 [&>div>*:last-child]:mb-0",
      "sm:[&>div>*:first-child]:mt-0 sm:[&>div>*:last-child]:mb-0",
      "sm:[&>div>*_pre]:mb-0",
      "[&_figure_pre]:mt-0 [&_figure_pre]:mb-0",
    ),
  },
  column: {
    root: "",
  },
  code: {
    // Full bleed on mobile
    root: classNames(
      "relative left-[50%] ml-[-50vw] right-[50%] mr-[-50vw] w-screen sm:left-0 sm:ml-0 sm:right-0 sm:mr-0 sm:w-full",
      "[&_pre]:px-container sm:[&_pre]:px-5",
      "[&_pre]:py-6",
      "[&_pre]:rounded-none sm:[&_pre]:rounded-lg",
      "[&_figcaption]:px-container sm:[&_figcaption]:px-0",
    ),
  },
} satisfies Partial<Classes>;

interface TodayILearnedArticleProps {
  titleAs: "h1" | "h2" | "h3";
  entry: TodayILearnedEntry;
}
export function TodayILearnedArticle({
  entry,
  titleAs: TitleComponent,
}: TodayILearnedArticleProps) {
  const isContentOnlyMode = useContentOnlyMode();
  const ReferencesTitleCompnent =
    TitleComponent === "h1" ? "h2" : TitleComponent === "h2" ? "h3" : "h4";
  return (
    <article key={entry.id}>
      {!isContentOnlyMode && (
        <>
          <TitleComponent
            id={entry.slug}
            className={`text-[32px] font-normal leading-tight md:text-h1`}
          >
            {entry.title}
          </TitleComponent>
          <time className="block mt-2 text-body lg:text-body">
            {dateFormatter.format(new Date(entry.publishedDate))}
          </time>

          <div className="mt-4 md:mt-6">
            <ul className="flex gap-2">
              {entry.tags.map((tag) => (
                <Badge as="li" key={tag.id} color={tag.color}>
                  {tag.title}
                </Badge>
              ))}
            </ul>
          </div>
        </>
      )}

      <div
        className={classNames(
          !isContentOnlyMode && "mt-6",
          "text-black/90",
          `prose-xl prose max-w-6xl`,
          "prose-pre:text-base",
          "prose-p:overflow-scroll",

          "prose-code:text-base",
          "prose-code:rounded",
          "prose-code:font-medium",
          "prose-code:py-1",

          "[&_figure:has(pre)]:mt-0",
          "[&_figure:has(pre)]:mb-0",
          "[&_figure_pre]:mb-0",
          "prose-figcaption:text-black/70",
          "prose-figcaption:mt-[0.8em]",
          "prose-figcaption:text-[0.9rem]",
        )}
      >
        <NotionRender
          components={todayILearnedComponents}
          classes={todayILearnedClasses}
          blocks={entry.blocks}
        />
      </div>
      {(entry.references?.length ?? 0) > 0 && (
        <div className="mt-8 lg:mt-12">
          <ReferencesTitleCompnent className="text-xl font-semibold md:text-2xl">
            Referanser
          </ReferencesTitleCompnent>
          <ul className="mt-3 space-y-2">
            {entry.references?.map((reference, i) => (
              <li key={i} className="text-lg">
                <a
                  className={classes.rich_text_anchor}
                  href={reference}
                  target="_blank"
                  rel="noreferrer"
                >
                  {reference}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
