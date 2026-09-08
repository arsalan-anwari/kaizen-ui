let depth = 0;
let gutter = "";

/* Fullscreen overlays cover the page but leave it scrollable behind them, so the
   document keeps its scrollbar and the wheel still moves the page underneath.
   Overlays nest, so count them: the last one to close releases the lock. */
export function lockScroll(_node: HTMLElement): { destroy(): void } {
  const root = document.documentElement;

  if (depth++ === 0) {
    /* Only reserve a gutter when a scrollbar is actually taking up space,
       otherwise hiding it would shift the page. Overlay scrollbars measure 0. */
    gutter = window.innerWidth - root.clientWidth > 0 ? "stable" : "";
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = gutter;
  }

  return {
    destroy(): void {
      if (--depth > 0) return;
      root.style.overflow = "";
      root.style.scrollbarGutter = "";
    }
  };
}
