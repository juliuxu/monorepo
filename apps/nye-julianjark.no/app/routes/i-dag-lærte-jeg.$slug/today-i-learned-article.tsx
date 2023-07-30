import type { Classes } from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";
import { Link } from "@remix-run/react";
import { classes, components } from "~/routes/$notionPage/notion-driven-page";
import type { TodayILearnedEntry } from "~/service/notion-today-i-learned/schema-and-mapper";
import { classNames } from "~/misc";
import { dateFormatter } from "~/routes/$notionPage/custom-blocks/latest-today-i-learned-entries";

const todayILearnedClasses /*tw*/ = {
  ...classes,
  column_list: {
    root: classNames(
      "mt-[1.2em]",
      "grid gap-0 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-flow-col sm:auto-cols-fr",
      "[&>div:first-child>*:first-child]:mt-0 [&>div>*:last-child]:mb-0",
      "sm:[&>div>*:first-child]:mt-0 sm:[&>div>*:last-child]:mb-0",
      "sm:[&>div>*_pre]:mb-0",
      "[&_figure]:mt-0 [&_figure]:mb-0 [&_figure_pre]:mt-0 [&_figure_pre]:mb-0"
    ),
  },
  column: {
    root: "",
  },
  code: {
    // Full bleed on mobile
    root: classNames(
      "relative left-[50%] ml-[-50vw] right-[50%] mr-[-50vw] w-screen sm:left-0 sm:ml-0 sm:right-0 sm:mr-0 sm:w-full",
      "[&_pre]:pl-[7.5vw] [&_pre]:pr-[7.5vw] sm:[&_pre]:pl-5 sm:[&_pre]:pr-5",
      "[&_pre]:pt-6 [&_pre]:pb-6 sm:[&_pre]:pt-4 sm:[&_pre]:pb-4",
      "[&_pre]:rounded-none sm:[&_pre]:rounded-lg",
      "[&_figcaption]:pl-[7.5vw] sm:[&_figcaption]:pl-0"
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
  const ReferencesTitleCompnent =
    TitleComponent === "h1" ? "h2" : TitleComponent === "h2" ? "h3" : "h4";
  return (
    <article key={entry.id}>
      <time className="text-body text-gray-700 lg:text-body">
        {dateFormatter.format(new Date(entry.publishedDate))}
      </time>
      <TitleComponent
        id={entry.slug}
        className={`mt-2 scroll-mt-[calc(6vw+2.5rem)] text-h2 lg:text-h2-lg`}
      >
        <Link
          to={`/i-dag-lærte-jeg/${entry.slug}`}
          preventScrollReset
          className="hover:underline"
        >
          {entry.title}
        </Link>
      </TitleComponent>
      <div
        className={classNames(
          "mt-8",
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
          "prose-figcaption:text-black/70"
        )}
      >
        <NotionRender
          {...{ components, classes: todayILearnedClasses }}
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
