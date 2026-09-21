import type { Mastery } from "./mastery";

export function heatColor(share: number): string {
  const percent = Math.round(Math.min(1, Math.max(0, share)) * 100);
  return `color-mix(in oklab, var(--color-success) ${percent}%, var(--color-danger))`;
}

const masteryMarks: Record<Exclude<Mastery, "new">, number> = {
  shaky: 0.2,
  learning: 0.48,
  steady: 0.7,
  mastered: 0.95
};

export function masteryColor(level: Mastery): string {
  return level === "new" ? "var(--color-secondary)" : heatColor(masteryMarks[level]);
}

// The same ramp laid over a surface, faint enough to read text on.
export function heatFill(share: number, strength = 18): string {
  return `color-mix(in oklab, ${heatColor(share)} ${strength}%, var(--color-surface))`;
}
