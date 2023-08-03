import type { LoaderArgs } from "@remix-run/node";
import { generateImageResponse } from "~/image-response/image-response";
import { assertItemFound } from "~/misc";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";

const colors = {
  primary: "#FFB4B4",
  secondary: "#E3673A",
} as const;

export async function loader({ request, params }: LoaderArgs) {
  const slug = params.slug ?? "";
  const { entries } = await getAllTodayILearnedEntriesAndMetainfo(
    isPreviewModeFromRequest(request)
  );
  const entry = entries.find((entry) => entry.slug === slug);
  assertItemFound(entry);

  return generateImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        backgroundImage: `linear-gradient(to bottom, #dbf4ff, #fff1f1)`,
        fontSize: 100,
        letterSpacing: -2,
        fontWeight: 700,
        textAlign: "center",
        // padding: "0 12px",
      }}
    >
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))`,
          backgroundClip: "text",
          color: "transparent",
          fontSize: "0.8em",
        }}
      >
        I dag lærte jeg
      </div>
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))`,
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {entry.title}
      </div>
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {/* {dateFormatterShort.format(new Date(entry.publishedDate))} */}
      </div>
    </div>,
    {
      width: 1600,
      height: 800,
    }
  );
}
