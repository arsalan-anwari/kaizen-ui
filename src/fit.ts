/**
 * Shrinks a text element until it fits inside its parent, the frame CSS gives
 * it room in. CSS sets the largest size; this only ever takes it down, and it
 * measures the laid-out text rather than predicting it, so the face, the
 * weight and the way the locale breaks lines are all accounted for.
 *
 * The text stays on one line until it runs past five and a half em, so a
 * five-kana word is never split while a long greeting or a two-word meaning
 * is.
 */
export function fit(node: HTMLElement): { destroy: () => void } {
  const frame = node.parentElement;
  if (frame === null) return { destroy() {} };

  // Down by the line boxes, not scrollHeight: Chromium counts a Japanese face's
  // content area, which runs well past a tight line height, as overflow even
  // though the ink stays inside, so nothing ever fit and the text fell to 1px.
  const fits = (size: number): boolean => {
    node.style.fontSize = `${size}px`;
    return node.scrollWidth <= node.clientWidth && node.offsetHeight <= frame.clientHeight;
  };

  // The largest whole-pixel size up to `high` that fits.
  const largest = (high: number): number => {
    if (fits(high)) return high;
    let low = 1;
    while (high - low > 1) {
      const mid = Math.floor((low + high) / 2);
      if (fits(mid)) low = mid;
      else high = mid;
    }
    return low;
  };

  const run = (): void => {
    node.style.fontSize = "";
    node.style.whiteSpace = "nowrap";
    const full = parseFloat(getComputedStyle(node).fontSize);
    let size = largest(full);
    // At nowrap the element is as wide as its one line.
    node.style.fontSize = `${size}px`;
    if (node.clientWidth > 5.5 * size) {
      node.style.whiteSpace = "";
      size = largest(full);
    }
    node.style.fontSize = `${size}px`;
  };

  run();
  // The frame follows the viewport, and a face that was still loading measured
  // as its fallback.
  const box = new ResizeObserver(run);
  box.observe(frame);
  document.fonts?.addEventListener("loadingdone", run);
  return {
    destroy() {
      box.disconnect();
      document.fonts?.removeEventListener("loadingdone", run);
    }
  };
}
