import { useLocation } from "@remix-run/react";
import { useEffect } from "react";

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

  // Track all page views, including the initial one
  useEffect(() => {
    (window as any)._paq?.push([
      "setCustomUrl",
      location.pathname + location.search,
    ]);
    (window as any)._paq?.push(["setDocumentTitle", document.title]);
    (window as any)._paq?.push(["trackPageView"]);
  }, [location]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="//${hostname}/";
            _paq.push(['setTrackerUrl', u+'${trackerPath}']);
            _paq.push(['setSiteId', '${siteId}']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'${scriptPath}'; s.parentNode.insertBefore(g,s);
          })();
          `,
        }}
      />
    </>
  );
}
