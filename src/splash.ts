
export function dismissSplash(id = "splash"): void {
  const splash = document.getElementById(id);
  if (splash === null) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      splash.dataset.done = "";
      splash.addEventListener("transitionend", () => splash.remove(), { once: true });

      setTimeout(() => splash.remove(), 600);
    });
  });
}
