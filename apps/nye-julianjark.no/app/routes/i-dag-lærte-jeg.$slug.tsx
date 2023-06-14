import type { HeadersFunction } from "@remix-run/node";
import { config } from "~/config.server";

export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function Component() {
  return <>TODO</>;
}
