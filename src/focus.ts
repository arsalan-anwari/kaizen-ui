let seen: unknown;

export function focusMain(key: unknown, id = "main"): void {
  if (seen === undefined) {
    seen = key;
    return;
  }
  if (seen === key) return;
  seen = key;
  if (typeof document === "undefined") return;
  document.getElementById(id)?.focus({ preventScroll: true });
}
