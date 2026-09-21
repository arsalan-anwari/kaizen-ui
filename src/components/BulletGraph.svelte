<script lang="ts">
  import { masteryColor } from "../heat";
  import { masteryBounds, scoredMasteryLevels, type MasteryLabels, type StatRow } from "../mastery";
  import HeatLegend from "./HeatLegend.svelte";

  let {
    rows,
    labels,
    describe,
    empty,
    class: className = ""
  }: {
    rows: StatRow[];
    labels: MasteryLabels;
    describe: (row: StatRow) => string;
    empty: string;
    class?: string;
  } = $props();

  const bandStarts: Record<(typeof scoredMasteryLevels)[number], number> = {
    shaky: 0,
    learning: masteryBounds.shaky,
    steady: masteryBounds.learning,
    mastered: masteryBounds.steady
  };

  const trackGradient = `linear-gradient(to right, ${masteryColor("shaky")} 0%, ${masteryColor(
    "learning"
  )} ${bandStarts.learning * 100}%, ${masteryColor("steady")} ${bandStarts.steady * 100}%, ${masteryColor(
    "mastered"
  )} 100%)`;
</script>

{#if rows.length === 0}
  <p class="py-6 text-center text-sm text-muted-foreground">{empty}</p>
{:else}
  <div class="flex flex-col gap-3 {className}">
    <div
      class="grid items-center gap-x-2.5 gap-y-2"
      style="grid-template-columns: auto minmax(0, 1fr) auto;"
    >
      {#each rows as row, index (row.key)}
        <span
          class="w-20 shrink-0 truncate text-xs font-semibold sm:w-28"
          style="grid-row: {index + 1}; grid-column: 1;"
        >
          {row.label}
        </span>
        <div
          role="img"
          aria-label={describe(row)}
          title={describe(row)}
          class="relative h-6 min-w-0"
          style="grid-row: {index + 1}; grid-column: 2;"
        >
          <div
            aria-hidden="true"
            class="absolute inset-y-0 -inset-x-1.5 overflow-hidden rounded-md"
            style="background: {trackGradient};"
          ></div>
          <div
            class="absolute inset-y-[28%] left-0.5 rounded-sm bg-foreground shadow-[0_0_0_2px_var(--color-surface)]"
            style="width: {Math.min(1, row.strength) * 100}%"
          ></div>
        </div>
        <span
          class="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground"
          style="grid-row: {index + 1}; grid-column: 3;"
        >
          {row.correct}/{row.total}
        </span>
      {/each}
    </div>
    <HeatLegend {labels} />
  </div>
{/if}
