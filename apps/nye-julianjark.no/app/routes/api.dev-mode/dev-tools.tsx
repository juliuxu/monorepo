import {
  DevBox,
  InvisibleBoxTrigger,
  PreviewModeIndicator,
  toggleDevMode,
  togglePreviewMode,
  useShortcut,
} from "@julianjark/dev-tools";
import type {
  DevMode,
  PreviewMode,
} from "@julianjark/dev-tools/dist/index.server.js";

import { ClearCacheButton } from "~/routes/api.clear-cache";
import { openCurrentNotionPage } from "../($prefix).$notionPage/use-edit-notion-page";

interface DevToolsProps {
  previewMode?: PreviewMode;
  devMode?: DevMode;
}
export function DevTools({ previewMode, devMode }: DevToolsProps) {
  const onTogglePreviewMode = () =>
    togglePreviewMode({
      previewMode,
      apiEndpoint: "/api/preview-mode",
    });
  useShortcut("pp", onTogglePreviewMode);

  const onToggleDevMode = () =>
    toggleDevMode({
      devMode,
      apiEndpoint: "/api/dev-mode",
    });
  useShortcut("dd", onToggleDevMode);

  useShortcut("ee", openCurrentNotionPage);

  return (
    <>
      <PreviewModeIndicator preivewMode={previewMode} />
      {devMode?.enabled ? (
        <DevBox>
          <div className="flex gap-6 lg:gap-12 [&_button:hover]:scale-125 [&_button]:transition-all">
            <ClearCacheButton shortcut="rr">🔄</ClearCacheButton>
            <button
              title="Edit notion page/database"
              type="button"
              onClick={openCurrentNotionPage}
            >
              ✍️
            </button>
            <button
              title="Toggle preview mode"
              type="button"
              onClick={onTogglePreviewMode}
            >
              👀
            </button>
            <button
              title="Hide dev tools"
              type="button"
              onClick={onToggleDevMode}
            >
              ⌄
            </button>
          </div>
        </DevBox>
      ) : (
        <InvisibleBoxTrigger requiredClicks={3} onTrigger={onToggleDevMode} />
      )}
    </>
  );
}
