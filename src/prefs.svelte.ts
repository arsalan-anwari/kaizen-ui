

import { clampZoom, zoomStep, type Theme } from "./appearance";
import { loadJson } from "./storage";

export type Prefs = {
  theme: Theme;
  contrast: boolean;
  sound: boolean;
  zoom: number;
  /** A locale tag, or "auto" to follow the browser. */
  locale: string;
};

export const prefsKey = "kaizen-prefs";

const defaults: Prefs = {
  theme: "system",
  contrast: false,
  sound: true,
  zoom: 1,
  locale: "auto"
};

// Module state, so a header and a settings sheet edit the same prefs.
export const prefs = $state<Prefs>({
  ...defaults,
  ...loadJson<Partial<Prefs>>(prefsKey, {})
});

/** Steps the zoom by whole steps, clamped to the supported range. */
export function zoomBy(steps: number): void {
  prefs.zoom = clampZoom(prefs.zoom + steps * zoomStep);
}
