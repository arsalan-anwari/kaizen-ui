export type AreaSparkSeries = {
  key: string;
  label: string;
  average: number;
  points: readonly number[];
};

export type AreaSparkGroup = { key: string; label: string; series: AreaSparkSeries[] };
