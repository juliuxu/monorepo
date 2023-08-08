import { useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { notionClient, warmUpCache } from "~/clients.server";

import julianFace from "~/assets/julian-face.svg";
import { useShortcut } from "@julianjark/dev-tools";
import { createPortal } from "react-dom";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "DELETE") throw new Error("only DELETE allowed");
  notionClient.clearCache();

  setTimeout(() => {
    warmUpCache();
  }, 15 * 1000);

  return new Response("", { status: 204 });
};

export function ClearCacheButton({
  shortcut,
  children,
}: {
  shortcut: string;
  children?: React.ReactNode;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reloadWithoutCache = async () => {
    if (isSubmitting) return;

    // Create a DOM node to host the loading box
    const element = document.createElement("div");
    element.id = "loading-box";
    document.body.appendChild(element);

    setIsSubmitting(true);
    document.body.style.overflowY = "hidden";
    await fetch(`/api/clear-cache`, { method: "DELETE" });
    document.cookie = "no_cache=1;max-age=15";
    window.location.reload();
  };
  useShortcut(shortcut, reloadWithoutCache);

  return (
    <>
      <button type="button" onClick={reloadWithoutCache}>
        {children}
      </button>
      {isSubmitting &&
        createPortal(
          <div className="fixed left-0 top-0 z-50 h-[100vh] w-[100vw]">
            <div className="flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50">
              <div className="animate-bounce">
                <span
                  className="text-white"
                  style={{
                    height: 134,
                    width: 80,
                    display: "inline-block",
                    backgroundColor: "currentColor",
                    WebkitMaskSize: "100%",
                    maskSize: "100%",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskImage: `url(${julianFace})`,
                    maskImage: `url(${julianFace})`,
                  }}
                />
              </div>
              <p
                className="mt-2 bg-gradient-to-r from-white to-white bg-clip-text text-lg text-transparent"
                style={{
                  WebkitBackgroundClip: "text",
                }}
              >
                Laster fersk data...
              </p>
            </div>
          </div>,
          document.getElementById("loading-box")!
        )}
    </>
  );
}
