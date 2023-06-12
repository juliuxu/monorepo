import type { HeadersFunction } from "@remix-run/node";
import { config } from "~/config.server";

export const headers: HeadersFunction = () => config.cacheControlHeaders;

export default function Component() {
  return <>TODO</>;
}
