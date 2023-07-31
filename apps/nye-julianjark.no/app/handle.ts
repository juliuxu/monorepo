import { useMatches } from "@remix-run/react";

export interface JulianHandle {
  scrollBehaviorSmooth?: boolean;
  headerMenu?: {
    title: string;
    href: string;
  };
}

export function useHeaderMenu() {
  const matches = useMatches();
  return matches
    .map((it) => it.handle as JulianHandle | undefined)
    .filter((it) => it?.headerMenu)[0]?.headerMenu;
}

export function useScrollBehaviorSmooth() {
  const matches = useMatches();
  return matches
    .map((it) => it.handle as JulianHandle | undefined)
    .some((it) => it?.scrollBehaviorSmooth);
}
