export type ChartPoint = { x: number; y: number };

export function scaledPoints(
  values: readonly number[],
  width: number,
  height: number,
  padding = 2
): ChartPoint[] {
  if (values.length === 0) return [];
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  if (values.length === 1) {
    const y = padding + innerHeight - ((values[0]! - min) / span) * innerHeight;
    return [
      { x: padding, y },
      { x: width - padding, y }
    ];
  }
  return values.map((value, index) => ({
    x: padding + (index / (values.length - 1)) * innerWidth,
    y: padding + innerHeight - ((value - min) / span) * innerHeight
  }));
}

export function linePath(points: readonly ChartPoint[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

export function areaPath(points: readonly ChartPoint[], height: number, padding = 2): string {
  if (points.length === 0) return "";
  const baseline = height - padding;
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${linePath(points)} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}
