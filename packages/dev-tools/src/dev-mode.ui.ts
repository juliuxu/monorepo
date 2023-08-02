import type { DevMode } from "./dev-mode.server";

interface DevModeToggleProps {
  devMode?: DevMode;
  apiEndpoint: string;
}
export async function toggleDevMode({
  devMode,
  apiEndpoint,
}: DevModeToggleProps) {
  const secret =
    devMode?.secret ?? window.prompt("Enter dev mode secret") ?? "";
  const devModeToSend: DevMode = {
    enabled: !devMode?.enabled,
    secret,
  };
  const response = await fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(devModeToSend),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    window.location.reload();
  }
}
