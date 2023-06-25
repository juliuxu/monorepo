import type { Orama, Result } from "@orama/orama";
import type {
  Position,
  SearchResultWithHighlight,
} from "@orama/plugin-match-highlight";
import { searchWithHighlight } from "@orama/plugin-match-highlight";
import { useEffect, useRef, useState } from "react";
import { HighlightedDocument } from "./highlighted-document";
import { groupDocumentsBy } from "./utils";
import { createTodayILearnedOramaIndex } from "./create-today-i-learned-index";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import type { loader } from "~/routes/i-dag-lærte-jeg";

export type OramaSearchProps = {
  limitResults: number;
  boost: {
    title: number;
    description: number;
    content: number;
  };
};

let oramaIndex: Orama;

const defaultProps: OramaSearchProps = {
  limitResults: 30,
  boost: {
    title: 2,
    description: 1,
    content: 1,
  },
};

export function OramaSearch(props: Partial<OramaSearchProps> = defaultProps) {
  const [, setIndexing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResultWithHighlight>();
  const [groupedResults, setGroupedResults] = useState<
    ReturnType<typeof groupDocumentsBy>
  >({});
  const [hasFocus, setHasFocus] = useState(false);
  const location = useLocation();

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const data = useLoaderData<typeof loader>();

  // As soon as the page loads, we create the index on the client-side
  useEffect(() => {
    setIndexing(true);

    createTodayILearnedOramaIndex(data.entries).then((index) => {
      oramaIndex = index;
      setIndexing(false);
    });
  }, []);

  // If the user types something, we search for it
  useEffect(() => {
    if (searchTerm) {
      searchWithHighlight(oramaIndex as any, {
        term: searchTerm,
        limit: props.limitResults,
        boost: props.boost,
      }).then((results) => {
        setResults(results);
        setGroupedResults(groupDocumentsBy(results.hits, "title"));
      });
    }
  }, [searchTerm]);

  // If the user presses ESC, we close the search box
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setHasFocus(true);
    } else {
      setHasFocus(false);
    }
  }, []);

  // If the path changes, we close the search box
  useEffect(() => {
    setHasFocus(false);
    setSearchTerm("");
  }, [location.key]);

  return (
    <div className="nextra-search mx-min-w-[200px] relative hidden sm:inline-block md:w-64">
      <div className="relative flex items-center text-gray-900 contrast-more:text-gray-800 ">
        <input
          ref={inputRef}
          spellCheck="false"
          type="search"
          placeholder="Søk i dagens lærdommer"
          className="block w-full appearance-none rounded-lg bg-black/[.05] px-3 py-2 text-base leading-tight transition-colors placeholder:text-gray-500 focus:bg-white contrast-more:border contrast-more:border-current md:text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => setHasFocus(true)}
          onBlur={() => {
            setHasFocus(false);
          }}
        />

        <kbd
          className="absolute z-20 my-1.5 flex h-5 cursor-pointer select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 transition-opacity hover:opacity-70 ltr:right-1.5 rtl:left-1.5 contrast-more:border-current contrast-more:text-current"
          title="Clear"
        >
          {hasFocus ? (
            "ESC"
          ) : (
            <>
              <span className="text-xs">⌘</span> K
            </>
          )}
        </kbd>
      </div>
      {searchTerm && results && (
        <div className="nextra-scrollbar absolute inset-x-0 top-full z-20 mt-2 max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)] min-h-[100px] w-screen max-w-[min(calc(100vw-2rem),calc(100%+20rem))] overflow-auto overscroll-contain rounded-xl border border-gray-200 bg-white py-2.5 text-gray-100 shadow-xl contrast-more:border contrast-more:border-gray-900 dark:border-neutral-800 dark:bg-neutral-900 contrast-more:dark:border-gray-50 md:max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)] ltr:md:left-auto rtl:md:right-auto">
          {results.count === 0 && (
            <div className="block select-none p-8 text-center text-sm text-gray-400">
              Ingen resultater.
            </div>
          )}
          {results.count > 0 && (
            <>
              <div ref={wrapperRef}>
                <ul>
                  {Object.keys(groupedResults).map((title) => (
                    <li key={title} className="bg-primary-600">
                      <div className="mx-2.5 mb-2 mt-6 select-none border-b border-black/10 px-2.5 pb-1.5 text-xs font-semibold uppercase text-gray-500 first:mt-0 contrast-more:border-gray-600 contrast-more:text-gray-900 dark:border-white/20 dark:text-gray-300 contrast-more:dark:border-gray-50 contrast-more:dark:text-gray-50">
                        {title}
                      </div>
                      <div className="mb-2 block scroll-m-12 px-2.5 py-2">
                        <ul className="mt-1">
                          {groupedResults[title].map((result, i) => (
                            <li
                              key={(result.document.url as string) + i}
                              className="hover:bg-primary-500 text-primary-600 mx-2.5 break-words rounded-md p-4"
                            >
                              <Link to={result.document.url as string}>
                                <div className="excerpt mt-1 text-sm leading-[1.35rem] text-gray-600">
                                  <HighlightedDocument hit={result as any} />
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  lang="en"
                  className="sticky bottom-0 bg-gray-100 p-4 text-sm"
                  style={{ transform: "translate(0px, 11px)" }}
                >
                  <p className="text-center text-gray-600">
                    <b>{results.count}</b> result{results.count > 1 && "s"}{" "}
                    found in <b>{results.elapsed.formatted}</b>. Powered by{" "}
                    <a
                      href="https://oramasearch.com"
                      target="_blank"
                      className="text-primary-600"
                      rel="noreferrer"
                    >
                      <b>Orama</b>
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
