import { PreviewModeToggle } from "~/routes/api.preview-mode/route";
import { ClearCacheButton } from "~/routes/api.clear-cache";
import { DevToolsTrigger, useShortcut } from "@julianjark/dev-tools";
import { useState } from "react";

export function DevTools() {
  const [devToolsEnabled, setDevtoolEnabled] = useState(false);
  useShortcut("dd", () => setDevtoolEnabled(true));
  return (
    <>
      <>
        <PreviewModeToggle />
        <ClearCacheButton />
      </>
      {!devToolsEnabled && (
        <DevToolsTrigger onTrigger={() => setDevtoolEnabled(true)} />
      )}
    </>
  );
}
