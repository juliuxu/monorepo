import type { BlockComponentProps } from "@julianjark/notion-render";
import { useNotionRenderContext } from "@julianjark/notion-render";
import { getTextFromRichText } from "@julianjark/notion-utils";
// import { Image } from "@unpic/react";
import { forwardRef } from "react";
import { classNames } from "~/utils/misc";
import { imageUrlBuilder } from "~/routes/api.notion-image";

const optimizedImageBaseUrl = "https://nye.julianjark.no/api/optimized-image";
export const optimzedImageTransformer = ({
  url,
  width,
  height,
}: {
  url: string | URL;
  width?: number;
  height?: number;
}) => {
  let options = "f_webp";
  if (width) options += `,w_${width}`;
  if (height) options += `,h_${height}`;
  return `${optimizedImageBaseUrl}/${options}/${encodeURIComponent(
    new URL(url).toString()
  )}`;
};

export const UnpicNotionImage = forwardRef<
  React.ElementRef<"img">,
  BlockComponentProps & {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
  }
>(({ block, className, onClick }, ref) => {
  const ctx = useNotionRenderContext();
  if (block.type !== "image") return null;

  const url = imageUrlBuilder({
    type: "image-block",
    blockId: block.id,
    lastEditedTime: block.last_edited_time,
  });

  const captionOptions = Object.fromEntries(
    new URLSearchParams(getTextFromRichText(block.image.caption))
  );
  const aspectRatio =
    Number(captionOptions.aspectRatio) > 0
      ? Number(captionOptions.aspectRatio)
      : undefined;
  return (
    <figure className={ctx.classes.image.root}>
      <img
        onClick={onClick}
        alt={captionOptions.alt ?? ""}
        src={optimzedImageTransformer({ url })}
        ref={ref}
        className={classNames(className)}
        style={{ objectFit: "cover", width: "100%", aspectRatio }}
        role="presentation"
      />
      {/* Unpic disabled for now... */}
      {/* <Image
          ref={ref}
          layout="fullWidth"
          className={ctx.classes.image.root}
          alt={captionOptions.alt ?? ""}
          src={url}
          aspectRatio={aspectRatio}
          priority
          transformer={optimzedImageTransformer}
        /> */}
      {captionOptions.caption && (
        <figcaption>{captionOptions.caption}</figcaption>
      )}
    </figure>
  );
});
