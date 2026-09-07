// Tracks whether the viewport is wide enough for the flat layout.

const WIDE = "(min-width: 640px)";
const COARSE = "(pointer: coarse)";

class Viewport {
  wide = $state(true);
  touch = $state(false);

  constructor() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const wide = window.matchMedia(WIDE);
    this.wide = wide.matches;
    wide.addEventListener("change", (event) => (this.wide = event.matches));
    this.touch = window.matchMedia(COARSE).matches;
  }
}

export const viewport = new Viewport();
