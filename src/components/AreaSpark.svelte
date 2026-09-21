<script lang="ts">
  import { areaPath, linePath, scaledPoints } from "../chart";

  let {
    values,
    width = 120,
    height = 36,
    color = "var(--color-gold)",
    label = "",
    class: className = ""
  }: {
    values: readonly number[];
    width?: number;
    height?: number;
    color?: string;
    label?: string;
    class?: string;
  } = $props();

  const points = $derived(scaledPoints(values, width, height));
  const line = $derived(linePath(points));
  const area = $derived(areaPath(points, height));
  const last = $derived(points.at(-1) ?? null);
</script>

<svg
  viewBox="0 0 {width} {height}"
  role={label === "" ? undefined : "img"}
  aria-label={label === "" ? undefined : label}
  class={className}
>
  {#if points.length > 0}
    <path d={area} fill={color} opacity="0.1" />
    <path
      d={line}
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    {#if last}
      <circle cx={last.x} cy={last.y} r="4" fill={color} stroke="var(--color-surface)" stroke-width="2" />
    {/if}
  {/if}
</svg>
