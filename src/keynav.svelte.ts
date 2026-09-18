import { viewport } from "./viewport.svelte";

export const FOCUSABLE = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

const SECTIONS =
  "header:not(main header, dialog header), main section:not(section section), main [data-section]";

function focusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.offsetParent !== null
  );
}

function sections(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(SECTIONS)].filter(
    (element) => element.offsetParent !== null
  );
}

function marked(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-keynav]");
}

function mark(element: HTMLElement | null): void {
  marked()?.removeAttribute("data-keynav");
  element?.setAttribute("data-keynav", "");
}

// Where the user actually is: focus wins over the mark, which goes stale as
// soon as they click or focus something in another section.
function current(): HTMLElement | null {
  const here =
    (document.activeElement as HTMLElement | null)?.closest<HTMLElement>(SECTIONS) ?? marked();
  if (here !== null && here !== marked()) mark(here);
  return here;
}

function enter(element: HTMLElement): void {
  mark(element);
  const first = focusable(element)[0];
  if (first === undefined) element.tabIndex = -1;
  (first ?? element).focus();
  element.scrollIntoView({ block: "nearest" });
}

function step(by: number): void {
  const all = sections();
  if (all.length === 0) return;
  const here = current();
  const at = here === null ? -1 : all.indexOf(here);
  enter(all[at < 0 ? 0 : Math.max(0, Math.min(all.length - 1, at + by))]);
}

function edge(root: HTMLElement | null, last: boolean): void {
  const section = root ?? current();
  if (section === null) return;
  const items = focusable(section);
  items[last ? items.length - 1 : 0]?.focus();
}

const MODALS = "dialog[open], [role='dialog'], [role='alertdialog']";

export function modalOpen(): boolean {
  return modal() !== null;
}

function modal(): HTMLElement | null {
  const open = [...document.querySelectorAll<HTMLElement>(MODALS)].filter(
    (element) => element.getClientRects().length > 0
  );
  return open.at(-1) ?? null;
}

function cycle(root: HTMLElement | null, back: boolean): boolean {
  const section = root ?? current();
  if (section === null) return false;
  const items = focusable(section);
  if (items.length === 0) {
    section.focus();
    return true;
  }
  const at = items.indexOf(document.activeElement as HTMLElement);
  if (at < 0) {
    items[0].focus();
    return true;
  }
  const next = (at + (back ? -1 : 1) + items.length) % items.length;
  items[next].focus();
  return true;
}

class KeyNav {
  active = $state(false);
  help = $state(false);

  get available(): boolean {
    return !viewport.touch;
  }

  set(on: boolean): void {
    if (!this.available) return;
    this.active = on;
    document.documentElement.classList.toggle("kbd-nav", on);
    // Anchor on a section straight away: Tab and the arrows are no-ops until
    // one is marked, so without this the first presses fall through to the
    // browser until some Shift+Arrow happens to mark one.
    mark(
      on
        ? ((document.activeElement as HTMLElement | null)?.closest<HTMLElement>(SECTIONS) ??
            sections()[0] ??
            null)
        : null
    );
    getSelection()?.removeAllRanges();
    document.dispatchEvent(new Event("keynav"));
  }

  handle(event: KeyboardEvent): boolean {
    if (event.ctrlKey && !event.altKey && !event.metaKey && (event.key === "/" || event.key === "?")) {
      event.preventDefault();
      this.set(!event.shiftKey);
      return true;
    }

    if (event.altKey || event.metaKey) return false;

    if (
      event.key === "?" &&
      !event.ctrlKey &&
      this.available &&
      !(event.target instanceof HTMLInputElement) &&
      !(event.target instanceof HTMLTextAreaElement)
    ) {
      event.preventDefault();
      this.help = true;
      return true;
    }

    const locked = modal();
    if (locked !== null && event.key === "Tab" && cycle(locked, event.shiftKey)) {
      event.preventDefault();
      return true;
    }

    if (!this.active) return false;

    if (event.shiftKey && !event.ctrlKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      if (locked === null) step(event.key === "ArrowDown" ? 1 : -1);
      return true;
    }

    if (event.ctrlKey && !event.shiftKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      if (locked === null) {
        scrollBy({ top: (event.key === "ArrowDown" ? 1 : -1) * innerHeight * 0.4, behavior: "smooth" });
      }
      return true;
    }

    if (event.key === "Tab" && cycle(null, event.shiftKey)) {
      event.preventDefault();
      return true;
    }

    if (!event.ctrlKey && !event.shiftKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return false;
      }
      event.preventDefault();
      edge(locked, event.key === "ArrowDown");
      return true;
    }

    return false;
  }
}

export const keynav = new KeyNav();

export type KeyNavLabels = {
  start: string;
  stop: string;
  section: string;
  next: string;
  previous: string;
  edges: string;
  scroll: string;
  select: string;
  confirm: string;
  close: string;
  /** Left out when the app has no tab bar to page through. */
  page?: string;
};

export function keynavShortcuts(labels: KeyNavLabels): { keys: string[]; label: string }[] {
  return [
    { keys: ["Ctrl", "/"], label: labels.start },
    { keys: ["Ctrl", "Shift", "/"], label: labels.stop },
    { keys: ["Shift", "↑", "↓"], label: labels.section },
    { keys: ["Tab"], label: labels.next },
    { keys: ["Shift", "Tab"], label: labels.previous },
    { keys: ["↑", "↓"], label: labels.edges },
    { keys: ["Ctrl", "↑", "↓"], label: labels.scroll },
    { keys: ["Space"], label: labels.select },
    { keys: ["Enter"], label: labels.confirm },
    ...(labels.page === undefined ? [] : [{ keys: ["Ctrl", "←", "→"], label: labels.page }]),
    { keys: ["Esc"], label: labels.close }
  ];
}
