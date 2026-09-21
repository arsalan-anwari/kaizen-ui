export type TreeTableRow = { key: string; label: string; total: number; correct: number };

export type TreeTableGroup = TreeTableRow & { children: TreeTableRow[] };
