export const masteryLevels = ["new", "shaky", "learning", "steady", "mastered"] as const;

export type Mastery = (typeof masteryLevels)[number];

export type MasteryLabels = Record<Mastery, string>;

export function strength(correct: number, total: number): number {
  if (total === 0) return 0;
  const z = 1;
  const share = correct / total;
  const centre = share + (z * z) / (2 * total);
  const spread = z * Math.sqrt((share * (1 - share) + (z * z) / (4 * total)) / total);
  return Math.max(0, (centre - spread) / (1 + (z * z) / total));
}

export const scoredMasteryLevels = ["shaky", "learning", "steady", "mastered"] as const;

export type ScoredMastery = (typeof scoredMasteryLevels)[number];

export const masteryBounds: Record<ScoredMastery, number> = {
  shaky: 0.35,
  learning: 0.6,
  steady: 0.85,
  mastered: 1
};

export function masteryOf(correct: number, total: number): Mastery {
  if (total === 0) return "new";
  const score = strength(correct, total);
  for (const level of scoredMasteryLevels) {
    if (score < masteryBounds[level]) return level;
  }
  return "mastered";
}

export type StatRow = {
  key: string;
  label: string;
  sub: string;
  total: number;
  correct: number;
  accuracy: number;
  strength: number;
  mastery: Mastery;
};

export type HeatCell = {
  key: string;
  glyph: string;
  romaji: string;
  total: number;
  correct: number;
  accuracy: number;
  strength: number;
  mastery: Mastery;
};

export type HeatRow = {
  id: string;
  label: string;
  total: number;
  correct: number;
  accuracy: number;
  strength: number;
  mastery: Mastery;
  cells: HeatCell[];
};
