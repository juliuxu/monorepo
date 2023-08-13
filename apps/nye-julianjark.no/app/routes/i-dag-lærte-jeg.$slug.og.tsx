import type { LoaderArgs } from "@remix-run/node";

import { ImageResponse } from "@vercel/og";

import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { getGoogleFont } from "~/utils/get-google-font";
import { assertItemFound } from "~/utils/misc";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colors = {
  primary: "#FFB4B4",
  secondary: "#E3673A",
} as const;

export async function loader({ request, params }: LoaderArgs) {
  const slug = params.slug ?? "";
  const { entries } = await getAllTodayILearnedEntriesAndMetainfo(
    isPreviewModeFromRequest(request),
  );
  const entry = entries.find((entry) => entry.slug === slug);
  assertItemFound(entry);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
          fontSize: 80,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {/*  */}
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {entry.title}
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {/*  */}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await Promise.all([getGoogleFont("Inter")]).then((fonts) =>
        fonts.flat(),
      ),
    },
  );
}
