import type { Highlighter, Theme, Lang } from "shiki";
import shiki from "shiki";

import type { Options } from "./prepare";

/**
 * Keep a single shiki instance in memory
 * there is a memory leak if we create and destroy
 *
 * Best option is to use a worker thread
 * second best is to use a single instance and accept one time memory cost
 *
 * https://kentcdodds.com/blog/fixing-a-memory-leak-in-a-production-node-js-app#shiki-fix
 */
let highlighter: Highlighter;
const loaderPromises: Record<string, Promise<void> | undefined> = {};

const defaultTheme: Theme = "nord";

/**
 * Transform text into HTML using shiki
 */
export async function shikiTransform(
  codeText: string,
  options: Options,
  type: "block" | "inlined" = "block",
) {
  if (!highlighter) {
    highlighter = await shiki.getHighlighter({ theme: defaultTheme });
  }

  const theme = options.theme ?? defaultTheme;
  if (theme && !highlighter.getLoadedThemes().includes(theme as Theme)) {
    // Handle race conditions
    const promise =
      loaderPromises[theme] ??
      highlighter
        .loadTheme(theme)
        // Fix: handle bug where multiple consumers try to load/access the theme,
        // but it's for some reason not loaded yet
        .then(() => new Promise((r) => setTimeout(r, 20)));
    await promise;
  }

  if (
    options.language &&
    !highlighter.getLoadedLanguages().includes(options.language as Lang)
  ) {
    // Handle race conditions
    if (!loaderPromises[options.language]) {
      loaderPromises[options.language] = highlighter.loadLanguage(
        options.language as Lang,
      );
    }
    await loaderPromises[options.language];
  }

  const foregroundColor = highlighter.getForegroundColor(theme);
  const backgroundColor = highlighter.getBackgroundColor(theme);
  let codeHtml = highlighter.codeToHtml(codeText, {
    ...options,
    lang: options.language,
    theme,
    lineOptions: options.highlight?.map((line) => ({
      line,
      classes: ["highlight"],
    })),
  });

  // Mutate the result.
  // A better solution would be to use `codeToThemedTokens` and render the tokens ourselves
  // For now, this is good enough

  // Filename
  if (options.filename) {
    codeHtml = codeHtml.replace(
      `<pre`,
      `<pre data-filename="${options.filename}"`,
    );
  }

  // Linenumbers
  if (options.linenumbers) {
    codeHtml = codeHtml.replace(`<pre`, `<pre data-line-numbers="true"`);
  }

  // Copyable
  if (options.copyable) {
    codeHtml = codeHtml.replace(`<pre`, `<pre data-copyable="true"`);
  }

  // Caption
  if (options.caption) {
    codeHtml = codeHtml.replace(
      `<pre`,
      `<pre data-caption="${options.caption}"`,
    );
  }

  // Inlined code
  if (type === "inlined") {
    codeHtml = codeHtml.replace(
      /<pre.+<code>/g,
      `<code style="background-color: ${backgroundColor}">`,
    );
    codeHtml = codeHtml.replace(/<\/code><\/pre>/g, `</code>`);
  }

  return {
    codeHtml,
    foregroundColor,
    backgroundColor,
  };
}
