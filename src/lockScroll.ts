let depth = 0;
let gutter = "";

const dismissers: (() => void)[] = [];

let ours = 0;
let listening = false;

function popped(): void {
  if (ours > 0) {
    ours -= 1;
    return;
  }
  dismissers.pop()?.();
}

export function lockScroll(_node: HTMLElement, dismiss?: () => void): { destroy(): void } {
  const root = document.documentElement;

  if (depth++ === 0) {

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
