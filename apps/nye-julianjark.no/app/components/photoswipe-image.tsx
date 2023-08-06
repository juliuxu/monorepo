import { useEffect } from "react";

import PhotoSwipe from "photoswipe";
import "photoswipe/photoswipe.css";

interface PhotoSwipeImageProps {
  children: ({
    ref,
    onClick,
  }: {
    ref: React.Ref<React.ElementRef<"img">>;
    onClick: React.MouseEventHandler<HTMLImageElement>;
  }) => React.ReactNode;
}

let pswp: PhotoSwipe | null = null;
export function PhotoSwipeImage({ children }: PhotoSwipeImageProps) {
  useEffect(() => {
    return () => {
      pswp?.close();
      pswp?.destroy();
    };
  }, []);

  const onClick: React.MouseEventHandler<HTMLImageElement> = (e) => {
    const element = e.currentTarget;
    const instance = new PhotoSwipe({
      index: 0,
      dataSource: [
        {
          index: 0,
          src: element.currentSrc,
          msrc: element.currentSrc,
          width: element.naturalWidth,
          height: element.naturalHeight,
          element,
        },
      ],
      initialPointerPos: { x: e.clientX, y: e.clientY },
    });
    pswp = instance;

    // Find caption from figcaption
    const siblingElement = element.nextElementSibling;
    if (siblingElement && siblingElement.tagName === "FIGCAPTION") {
      const caption = siblingElement.innerHTML;
      instance.on("uiRegister", () => {
        instance.ui?.registerElement({
          name: "default-caption",
          order: 9,
          isButton: false,
          appendTo: "root",
          onInit: (el) => {
            el.style.position = "absolute";
            el.style.bottom = "15px";
            el.style.left = "0";
            el.style.right = "0";
            el.style.padding = "0 20px";
            el.style.color = "var(--pswp-icon-color)";
            el.style.fontSize = "1rem";
            el.style.lineHeight = "1.5";
            el.style.display = "flex";
            el.style.justifyContent = "center";

            const captionElement = document.createElement("div");
            captionElement.style.textAlign = "center";
            captionElement.style.padding = "4px 8px";
            captionElement.style.background =
              "color-mix(in srgb, var(--pswp-bg), transparent 60%)";
            captionElement.style.backdropFilter = "blur(8px)";
            captionElement.style["-webkit-backdrop-filter" as any] =
              "blur(8px)";
            captionElement.style.borderRadius = "2px";
            captionElement.innerHTML = caption;

            el.appendChild(captionElement);
          },
        });
      });
    }

    pswp.on("destroy", () => {
      pswp = null;
    });

    pswp.init();
  };
  const ref = (element: HTMLImageElement) => {};

  return children({ ref, onClick });
}
