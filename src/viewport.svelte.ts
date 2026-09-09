// Tracks whether the viewport is wide enough for the flat layout.

const WIDE = "(min-width: 640px)";
const COARSE = "(pointer: coarse)";
const SHORT = "(max-height: 560px)";

/* Android WebView only reports safe-area-inset-top for a display cutout, so a
   plain status bar reads as 0 and a fullscreen overlay lands underneath it.
   Reserve the platform default instead (24dp, and a CSS pixel is a dp there);
   the theme keeps whichever of the two is larger.
   ponytail: fixed 24dp default, read the real inset from the platform if a
   device ever hides more than that behind the bar. */
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
