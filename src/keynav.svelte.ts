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

// Rendered and not hidden. offsetParent misses fixed-position elements, and
// passes content WebKit will not focus: a closed <details>, visibility:hidden.
function shown(element: HTMLElement): boolean {
  return (
    element.checkVisibility?.({ visibilityProperty: true }) ?? element.getClientRects().length > 0
  );
}

function focusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(shown);
}

// A section's own items, leaving out those of any section nested inside it.
function own(section: HTMLElement): HTMLElement[] {
  return focusable(section).filter((item) => item.closest(SECTIONS) === section);
}

// A section that only wraps other sections is not a stop of its own: entering
// it would land in the first nested one, and stepping back out would loop.
function sections(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(SECTIONS)].filter(
    (element) =>
      shown(element) && (element.querySelector(SECTIONS) === null || own(element).length > 0)
  );
}

function marked(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-keynav]");
}

// Where the mark sat among the sections, for when a re-render swaps that
// section out from under it (a quiz's next question).
let slot = -1;

function mark(element: HTMLElement | null): void {
  marked()?.removeAttribute("data-keynav");
  element?.setAttribute("data-keynav", "");
  slot = element === null ? -1 : sections().indexOf(element);
}

// Where to pick up once focus and the mark are both gone. Focus dropped to
// the body means a re-render took them: the section now in the same slot.
// Otherwise it moved on purpose, say to <main> on a new screen: the first
// section of the page on screen, the header left out as it is always pinned.
function lost(): HTMLElement | null {
  const all = sections();
  if (document.activeElement === document.body && all[slot] !== undefined) return all[slot];
  const seen = all.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.bottom > 0 && box.top < innerHeight;
  });
  return seen.find((element) => element.closest("main") !== null) ?? seen[0] ?? all[0] ?? null;
}

// Where the user actually is: focus wins over the mark, which goes stale as
// soon as they click or focus something in another section.
function current(): HTMLElement | null {
  const here =
    (document.activeElement as HTMLElement | null)?.closest<HTMLElement>(SECTIONS) ??
    marked() ??
    lost();
  if (here !== null && here !== marked()) mark(here);
  return here;
}

// Walks from `start` by `by` until an item takes focus. Anything can still
// refuse it, and retrying one that does would pin Tab in place for good.
function focusFrom(items: HTMLElement[], start: number, by: number): boolean {
  for (let tried = 0; tried < items.length; tried += 1) {
    const item = items[(((start + by * tried) % items.length) + items.length) % items.length];
    item.focus();
    if (document.activeElement === item) return true;
  }
  return false;
}

function land(element: HTMLElement): void {
  if (!element.hasAttribute("tabindex")) element.tabIndex = -1;
  element.focus();
}

function enter(element: HTMLElement): void {
  mark(element);
  if (!focusFrom(own(element), 0, 1)) land(element);
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
  const items = root === null ? own(section) : focusable(section);
  focusFrom(items, last ? items.length - 1 : 0, last ? -1 : 1);
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
  const items = root === null ? own(section) : focusable(section);
  const at = items.indexOf(document.activeElement as HTMLElement);
  const by = back ? -1 : 1;
  if (!focusFrom(items, at < 0 ? 0 : at + by, by)) land(section);
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
    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      (event.key === "/" || event.key === "?")
    ) {
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

    // WebKitGTK can report Shift+Tab (GDK's ISO_Left_Tab) as key "Unidentified"; code stays "Tab".
    const tab = event.key === "Tab" || event.code === "Tab";
    const locked = modal();
    if (locked !== null && tab && cycle(locked, event.shiftKey)) {
      event.preventDefault();
      return true;
    }

    if (!this.active) return false;

    if (
      event.shiftKey &&
      !event.ctrlKey &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      event.preventDefault();
      if (locked === null) step(event.key === "ArrowDown" ? 1 : -1);
      return true;
    }

    if (
      event.ctrlKey &&
      !event.shiftKey &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      event.preventDefault();
      if (locked === null) {
        scrollBy({
          top: (event.key === "ArrowDown" ? 1 : -1) * innerHeight * 0.4,
          behavior: "smooth"
        });
      }
      return true;
    }

    // Tab is always ours here: the browser's own resumes from wherever the
    // mouse last clicked, and on WebKitGTK stepping past the last item hands
    // focus out of the web view, leaving every key dead until a click.
    if (tab) {
      event.preventDefault();
      cycle(null, event.shiftKey);
      return true;
    }

    if (
      !event.ctrlKey &&
      !event.shiftKey &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
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
