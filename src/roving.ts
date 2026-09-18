import { FOCUSABLE, keynav } from "./keynav.svelte";

export type RovingOptions = {
  selector?: string;
  wrap?: boolean;
};

export function roving(node: HTMLElement, options: RovingOptions = {}): {
  update(next: RovingOptions): void;
  destroy(): void;
} {
  let settings = options;
  let items: HTMLElement[] = [];
  let active = 0;

  function mark(): void {
    for (const [index, item] of items.entries()) {
      item.tabIndex = keynav.active || index === active ? 0 : -1;
    }
  }

  function scan(): void {
    items = [...node.querySelectorAll<HTMLElement>(settings.selector ?? FOCUSABLE)];
    if (items.length === 0) return;
    const chosen = items.findIndex((item) => {
      const current = item.getAttribute("aria-current");
      return (
        item.getAttribute("aria-selected") === "true" || (current !== null && current !== "false")
      );
    });
    active = chosen >= 0 ? chosen : Math.min(active, items.length - 1);
    mark();
  }

  function span(): number {
    if (items.length < 2) return 1;
    const top = items[0].offsetTop;
    const wrapped = items.findIndex((item) => item.offsetTop > top);
    return wrapped <= 0 ? items.length : wrapped;
  }

  function move(to: number): void {
    if (items.length === 0) return;
    const last = items.length - 1;
    const next =
      settings.wrap === true
        ? ((to % items.length) + items.length) % items.length
        : Math.max(0, Math.min(last, to));
    active = next;
    mark();
    items[next].focus();
  }

  function keydown(event: KeyboardEvent): void {
    if (keynav.active) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const from = items.indexOf(document.activeElement as HTMLElement);
    if (from < 0) return;

    switch (event.key) {
      case "ArrowRight":
        move(from + 1);
        break;
      case "ArrowLeft":
        move(from - 1);
        break;
      case "ArrowDown":
        move(from + span());
        break;
      case "ArrowUp":
        move(from - span());
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(items.length - 1);
        break;
      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  function focusin(event: FocusEvent): void {
    const at = items.indexOf(event.target as HTMLElement);
    if (at < 0 || at === active) return;
    active = at;
    mark();
  }

  scan();

  const observer = new MutationObserver(() => scan());
  // Also watch `disabled`: arrows that enable or disable mid-use change the item list.
  observer.observe(node, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled"]
  });
  node.addEventListener("keydown", keydown);
  node.addEventListener("focusin", focusin);
  document.addEventListener("keynav", mark);

  return {
    update(next: RovingOptions): void {
      settings = next;
      scan();
    },
    destroy(): void {
      observer.disconnect();
      node.removeEventListener("keydown", keydown);
      node.removeEventListener("focusin", focusin);
      document.removeEventListener("keynav", mark);
    }
  };
}
