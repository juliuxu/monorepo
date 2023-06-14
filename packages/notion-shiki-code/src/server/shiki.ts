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

const defaultTheme: Theme = "nord";

/**
 * Transform text into HTML using shiki
 */
export async function shikiTransform(codeText: string, options: Options) {
  if (!highlighter) {
    highlighter = await shiki.getHighlighter({ theme: defaultTheme });
  }

  const theme = options.theme ?? defaultTheme;
  if (theme && !highlighter.getLoadedThemes().includes(theme as Theme)) {
    await highlighter.loadTheme(theme);
  }

  if (!highlighter.getLoadedLanguages().includes(options.language as Lang)) {
    await highlighter.loadLanguage(options.language as Lang);
  }

  return {
    codeHtml: highlighter.codeToHtml(codeText, {
      ...options,
      lang: options.language,
      theme,
    }),
    foregroundColor: highlighter.getForegroundColor(theme),
    backgroundColor: highlighter.getBackgroundColor(theme),
  };
}
