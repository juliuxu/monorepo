import { useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { notionClient } from "~/clients.server";

import { useShortcut } from "~/components/use-shortcut";

export function ClearCacheButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reloadWithoutCache = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    document.body.style.overflowY = "hidden";
    await fetch(`/api/clear-cache`, { method: "DELETE" });
    document.cookie = "no_cache=1;max-age=15";
    window.location.reload();
  };
  useShortcut("rr", reloadWithoutCache);
  return (
    <>
      {isSubmitting && (
        <div className="fixed left-0 top-0 z-50 h-[100vh] w-[100vw]">
          <div className="flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50">
            <span className="loading loading-spinner w-12 text-primary"></span>
            <p className="mt-2 bg-gradient-to-r from-white to-primary bg-clip-text text-lg text-transparent">
              Laster fersk data...
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={reloadWithoutCache}
        className="text-3xl"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        <div className="rotate-90">↻</div>
      </button>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "DELETE") throw new Error("only DELETE allowed");
  await notionClient.clearCache();
  return new Response("", { status: 204 });
};
