import { PreviewModeToggle } from "~/routes/api.preview-mode/route";
import { ClearCacheButton } from "~/routes/api.clear-cache";

export function DevTools() {
  return (
    <>
      <PreviewModeToggle />
      <ClearCacheButton />
    </>
  );
}
