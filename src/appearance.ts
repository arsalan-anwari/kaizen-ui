// Theme, contrast and zoom, written onto the document root.

export type Theme = "system" | "light" | "dark";

export const zoomMin = 0.7;
export const zoomMax = 1.2;
export const zoomStep = 0.05;

export function clampZoom(value: number): number {
  if (!Number.isFinite(value)) return 1;
  const stepped = Math.round(value / zoomStep) * zoomStep;
  return Math.min(zoomMax, Math.max(zoomMin, Number(stepped.toFixed(2))));
}

export function applyAppearance(options: {
  theme: Theme;
  contrast: boolean;
  zoom: number;
}): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  // high contrast replaces the theme entirely
  if (!options.contrast && options.theme !== "system") root.classList.add(options.theme);
  root.classList.toggle("high-contrast", options.contrast);
  // every size is in rem, so the root size drives the zoom
  root.style.fontSize = `${Math.round(clampZoom(options.zoom) * 100)}%`;
}
