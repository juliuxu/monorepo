import { useLocation } from "@remix-run/react";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    _paq?: string[][];
  }
}

interface MatomoAnalyticsProps {
  hostname: string;
  siteId: string;
  scriptPath: string;
  trackerPath: string;
}

/**
 * Connects to a Matomo instance and sends page views
 */
export function MatomoAnalytics({
  hostname,
  siteId,
  scriptPath,
  trackerPath,
}: MatomoAnalyticsProps) {
  const location = useLocation();
  const previousPath = useRef<string>();

  // Track all page views, including the initial one
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (currentPath === previousPath.current) return;

    if (previousPath.current) {
      window._paq?.push(["setReferrerUrl", previousPath.current]);
    }
    window._paq?.push(["setCustomUrl", currentPath]);
    window._paq?.push(["setDocumentTitle", document.title]);
    window._paq?.push(["trackPageView"]);

    previousPath.current = currentPath;
  }, [location]);

  const trackerBasePath = `//${hostname}/`;
  return (
    <>
      {/* Initialise tracking config so it's ready as soon as possible */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          var _paq = window._paq = window._paq || [];
          _paq.push(['enableLinkTracking']);
          (function() {
            _paq.push(['setTrackerUrl', '${trackerBasePath + trackerPath}']);
            _paq.push(['setSiteId', '${siteId}']);
          })();
          `,
        }}
      />
      <script src={trackerBasePath + scriptPath} async />
    </>
  );
}
