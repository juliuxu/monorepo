import type { HeadersFunction } from "@remix-run/node";
import { useParams, useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { config } from "~/config.server";

export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

/**
 * Make sure the linked Entry is selected when first loading the page
 */
export default function Component() {
  const { slug } = useParams();
  const { key } = useLocation();

  useEffect(() => {
    const element = document.getElementById(slug?.toLowerCase() ?? "");
    if (!element) return;
    element.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  }, [key, slug]);
  return (
    <script
      // Add an inline script to make sure the scroll happens immediately
      // on slow networks, before hydration.
      dangerouslySetInnerHTML={{
        __html: `
        document.addEventListener('DOMContentLoaded', () => {
          const element = document.getElementById("${slug}");
          element && element.scrollIntoView({
            block: "start",
            behavior: "auto",
          });
        });
    `,
      }}
    />
  );
}
