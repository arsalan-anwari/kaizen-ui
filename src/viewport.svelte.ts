// Tracks whether the viewport is wide enough for the flat layout.

const WIDE = "(min-width: 640px)";
const COARSE = "(pointer: coarse)";
const SHORT = "(max-height: 560px)";

const ANDROID_STATUS_BAR = "24px";
const ANDROID_NAV_BAR = "48px";

class Viewport {
  wide = $state(true);
  touch = $state(false);
  short = $state(false);

  constructor() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const wide = window.matchMedia(WIDE);
    this.wide = wide.matches;
    wide.addEventListener("change", (event) => (this.wide = event.matches));
    this.touch = window.matchMedia(COARSE).matches;

    const short = window.matchMedia(SHORT);
    this.short = short.matches;
    short.addEventListener("change", (event) => (this.short = event.matches));

    if (/android/i.test(navigator.userAgent)) {
      document.documentElement.style.setProperty("--status-bar-fallback", ANDROID_STATUS_BAR);
      document.documentElement.style.setProperty("--nav-bar-fallback", ANDROID_NAV_BAR);
    }
  }
}

export const viewport = new Viewport();
