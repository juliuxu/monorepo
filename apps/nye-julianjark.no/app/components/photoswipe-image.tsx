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
    pswp = new PhotoSwipe({
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

    pswp.on("destroy", () => {
      pswp = null;
    });

    pswp.init();
  };
  const ref = (element: HTMLImageElement) => {};

  return children({ ref, onClick });
}
