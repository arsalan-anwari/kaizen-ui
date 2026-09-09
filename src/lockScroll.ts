let depth = 0;
let gutter = "";

/* Overlays that asked to be dismissed by a back step, topmost last. Android has
   no Escape key: the back button and the back swipe both reach the webview as a
   history step, and with nothing on the stack the activity finishes and the app
   closes under the overlay. So an overlay that wants the back step pushes a
   history entry while it is open and takes that entry back off when it goes. */
const dismissers: (() => void)[] = [];

/* Closing by any other route (Escape, the close button, the backdrop) pops our
   own entry, and that pop arrives here as a popstate like any other. Count those
   so they are not mistaken for a back press against the overlay below. */
let ours = 0;
let listening = false;

function popped(): void {
  if (ours > 0) {
    ours -= 1;
    return;
  }
  dismissers.pop()?.();
}

/* Fullscreen overlays cover the page but leave it scrollable behind them, so the
   document keeps its scrollbar and the wheel still moves the page underneath.
   Overlays nest, so count them: the last one to close releases the lock. */
export function lockScroll(_node: HTMLElement, dismiss?: () => void): { destroy(): void } {
  const root = document.documentElement;

  if (depth++ === 0) {
    /* Only reserve a gutter when a scrollbar is actually taking up space,
       otherwise hiding it would shift the page. Overlay scrollbars measure 0. */
    gutter = window.innerWidth - root.clientWidth > 0 ? "stable" : "";
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = gutter;
  }

  if (dismiss !== undefined) {
    if (!listening) {
      window.addEventListener("popstate", popped);
      listening = true;
    }
    dismissers.push(dismiss);
    /* No URL: the entry only has to exist for the back step to land on. */
    history.pushState(null, "");
  }

  return {
    destroy(): void {
      if (--depth === 0) {
        root.style.overflow = "";
        root.style.scrollbarGutter = "";
      }

      if (dismiss === undefined) return;

      const at = dismissers.lastIndexOf(dismiss);
      if (at >= 0) {
        dismissers.splice(at, 1);
        ours += 1;
        history.back();
      }
    }
  };
}
