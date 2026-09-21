export type MissTile = { key: string; label: string; count: number };

export type MissSection = { key: string; label: string; total: number; tiles: MissTile[] };
