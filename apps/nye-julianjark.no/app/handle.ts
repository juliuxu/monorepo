import { useMatches } from "@remix-run/react";

export interface JulianHandle {
  scrollBehaviorSmooth: boolean;
}

export function useScrollBehaviorSmooth() {
  const matches = useMatches();
  return matches.map((it) => it.handle).some((it) => it?.scrollBehaviorSmooth);
}
