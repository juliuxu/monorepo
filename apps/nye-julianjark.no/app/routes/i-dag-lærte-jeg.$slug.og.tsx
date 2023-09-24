import type { LoaderFunctionArgs } from "@remix-run/node";

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

export async function loader({ request, params }: LoaderFunctionArgs) {
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
          padding: "48px 72px",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          letterSpacing: -1,

          backgroundColor: "#FFFFFF",
        }}
      >
        <div
          style={{
            // backgroundImage:
            //   "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
            // backgroundClip: "text",
            // color: "transparent",
            // fontWeight: 700,

            fontWeight: 500,

            textAlign: "left",
            fontSize: 50,
          }}
        >
          I dag lærte jeg
        </div>

        <div
          style={{
            // backgroundImage:
            //   "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            // backgroundClip: "text",
            // color: "transparent",
            // fontWeight: 700,

            fontWeight: 600,

            marginTop: 40,
            maxWidth: 780,
            textAlign: "left",
            wordBreak: "break-word",
            fontSize: entry.title.length > 50 ? 60 : 80,
          }}
        >
          {entry.title}
        </div>
        <div
          style={{
            // backgroundImage:
            //   "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
            // backgroundClip: "text",
            // color: "transparent",
            // fontWeight: 700,

            fontWeight: 500,
            color: colors.secondary,

            fontSize: 60,
            marginTop: "auto",
          }}
        >
          Julian Jark
        </div>
        <JulianFace
          style={{
            marginLeft: "auto",
            position: "absolute",
            right: 72,
            bottom: 24,
            opacity: 0.6,
            transform: "rotate(10deg)",
          }}
          strokeWidth={2}
          color={colors.secondary}
          height={460}
        />
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

interface JulianFaceProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  strokeWidth?: number;
}
function JulianFace({
  strokeWidth = 2,
  color = "currentColor",
  ...rest
}: JulianFaceProps) {
  return (
    <svg
      viewBox="0 0 80 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M29.092 68.9277C29.092 68.9277 30.4541 73.0291 32.6902 73.7253C35.0986 74.4751 38.6871 71.3265 38.6871 71.3265"
        stroke={color}
        stroke-width={strokeWidth}
      />
      <path
        d="M42.2708 55.4843C42.2708 55.4843 49.0872 52.4559 53.3472 53.9019C56.6574 55.0256 59.6766 58.649 59.6766 58.649"
        stroke={color}
        stroke-width={strokeWidth}
      />
      <path
        d="M15.3708 49.1553C15.3708 49.1553 22.0684 46.5417 26.4473 47.5729C30.2987 48.48 34.3591 52.32 34.3591 52.32"
        stroke={color}
        stroke-width={strokeWidth}
      />
      <path
        d="M42.2703 1.68435C54.1226 3.55067 59.9653 9.82434 67.5879 19.0902C73.7328 26.5599 78.0761 31.5887 78.6644 41.2432C79.0476 47.5333 76.0456 50.7885 75.4997 57.0667C75.0714 61.9917 76.674 64.9234 75.4997 69.7255C73.7079 77.0526 67.3733 78.6069 64.4232 85.549C60.5261 94.7194 65.3216 101.769 61.2585 110.867C56.8005 120.849 52.6632 128.045 42.2703 131.437C30.7288 135.204 20.8953 132.004 12.2055 123.525C8.06693 119.487 6.6544 116.26 4.35074 110.997L4.29379 110.867C-2.14862 96.1483 5.63875 85.7357 4.29379 69.7255C3.51098 60.4071 0.324771 55.3068 1.12908 45.9902C1.6191 40.3141 2.98077 37.2929 4.29379 31.7491C5.46818 26.7905 4.62351 23.3245 7.45849 19.0902C10.4159 14.6731 14.2428 14.3145 18.535 11.1785C23.5245 7.53286 25.2268 3.29085 31.1938 1.68435C35.3707 0.559801 37.9973 1.01151 42.2703 1.68435Z"
        stroke={color}
        stroke-width={strokeWidth}
      />
      <path
        d="M66.0088 66.5614L51.6748 88.1688C51.6748 88.1688 50.5694 85.9089 48.6029 83.9673C46.2349 81.6293 44.0196 80.8026 40.6919 80.8026C37.3641 80.8026 32.7769 83.9673 32.7769 83.9673C32.7769 83.9673 27.7193 79.67 23.286 79.2202C19.3977 78.8258 13.7911 80.8026 13.7911 80.8026C13.7911 80.8026 10.6145 77.597 9.04566 74.4732C7.45629 71.3085 6.69864 62.8609 7.46168 55.4849C8.51037 45.3476 6.77099 37.5554 13.7911 30.1673C23.1941 20.2714 35.4484 30.6505 48.6029 27.0026C52.369 25.9582 58.097 23.8379 58.097 23.8379C58.097 23.8379 67.1079 33.456 69.1735 41.2438C71.7279 50.8749 66.0088 66.5614 66.0088 66.5614Z"
        stroke={color}
        stroke-width={strokeWidth}
      />
      <circle cx="51.765" cy="61.8138" r="1.58235" fill={color} />
      <circle cx="23.2828" cy="55.4847" r="1.58235" fill={color} />
      <path
        d="M21.7004 89.1768C21.7004 89.1768 26.0008 92.4184 29.6122 93.4606C32.5808 94.3173 37.524 92.3415 37.524 92.3415"
        stroke={color}
        stroke-width={strokeWidth}
      />
    </svg>
  );
}
