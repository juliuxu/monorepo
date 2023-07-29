import { PreviewMode } from "./preview-mode.server";
import { useShortcut } from "./use-shortcut";

interface PreviewModeToggleProps {
  previewMode?: PreviewMode;
  apiEndpoint: string;
}
export function PreviewModeToggle({
  previewMode,
  apiEndpoint,
}: PreviewModeToggleProps) {
  async function togglePreviewMode() {
    const secret =
      previewMode?.secret ?? window.prompt("Enter preview secret") ?? "";
    const previewModeToSend: PreviewMode = {
      enabled: !previewMode?.enabled,
      secret,
    };
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: JSON.stringify(previewModeToSend),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      window.location.reload();
    }
  }
  useShortcut("pp", togglePreviewMode);
  if (!previewMode) return null;
  if (!previewMode.enabled) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .preview-mode-toggle {
          position: fixed;
          right: 0;
          top: 0;
          border-bottom-left-radius: 0.5rem;

          padding: 8px;

          font-size: 26px;
          line-height: 1.3;

          --webkit-font-smoothing: antialiased;
          backdrop-filter: blur(8px);

          color: rgb(227, 104, 59);
          background-color: rgba(227, 104, 59, 0.2);
          border-color: rgb(227, 104, 59);
        }

        @media (min-width: 1024px) {
          .preview-mode-toggle {
            font-size: 2.5vw;
          }
        }
        `,
        }}
      />
      <div className="preview-mode-toggle" lang="en">
        <button onClick={togglePreviewMode} title="Toggle preview mode">
          👀 Preview
        </button>
      </div>
    </>
  );
}
