import { useSearchParams } from "@remix-run/react";

export function useContentOnlyMode() {
  const [search] = useSearchParams();
  return search.get("content-only") === "true";
}
