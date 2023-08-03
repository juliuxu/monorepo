import satori from "satori";
import svg2img from "svg2img";

import { getGoogleFont } from "./get-google-font";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    tw?: string;
  }
}

/**
 * Build an image response from a JSX element
 */
export async function generateImageResponse(
  element: JSX.Element,
  options: { width: number; height: number }
) {
  // Generate SVG
  const svg = await satori(element, {
    ...options,
    fonts: await Promise.all([
      getGoogleFont("Inter"),
      getGoogleFont("Playfair Display"),
    ]).then((fonts) => fonts.flat()),
  });

  // Convert SVG to PNG
  const { data, error } = await new Promise(
    (
      resolve: (value: { data: Buffer | null; error: Error | null }) => void
    ) => {
      svg2img(svg, (error, buffer) => {
        if (error) {
          resolve({ data: null, error });
        } else {
          resolve({ data: buffer, error: null });
        }
      });
    }
  );
  if (error) {
    return new Response(error.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // Return the image
  return new Response(data, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control":
        process.env.NODE_ENV === "production"
          ? "public, max-age=31536000, immutable"
          : "no-cache",
    },
  });
}
