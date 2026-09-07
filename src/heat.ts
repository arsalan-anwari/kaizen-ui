export function heatColor(share: number): string {
  const percent = Math.round(Math.min(1, Math.max(0, share)) * 100);
  return `color-mix(in oklab, var(--color-success) ${percent}%, var(--color-danger))`;
}

// The same ramp laid over a surface, faint enough to read text on.
export function heatFill(share: number, strength = 18): string {
  return `color-mix(in oklab, ${heatColor(share)} ${strength}%, var(--color-surface))`;
}
