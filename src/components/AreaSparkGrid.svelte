<script lang="ts">
  import type { AreaSparkGroup, AreaSparkSeries } from "../area-spark";
  import AreaSpark from "./AreaSpark.svelte";
  import EmptyState from "./EmptyState.svelte";

  let {
    groups,
    empty,
    unit = "",
    describeSeries,
    class: className = ""
  }: {
    groups: AreaSparkGroup[];
    empty: string;
    unit?: string;
    describeSeries?: (series: AreaSparkSeries) => string;
    class?: string;
  } = $props();
</script>

{#if groups.length === 0}
  <EmptyState icon="sprout" title={empty} />
{:else}
  <div class="flex flex-col gap-4 {className}">
    {#each groups as group (group.key)}
      <div class="flex flex-col gap-2">
        <span class="text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">
          {group.label}
        </span>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
          {#each group.series as series (series.key)}
            <div class="flex flex-col gap-1 rounded-lg border-2 border-border bg-surface p-2.5">
              <span class="truncate text-xs font-semibold">{series.label}</span>
              <span class="text-base font-bold tabular-nums">{series.average}{unit}</span>
              <AreaSpark
                values={series.points}
                label={describeSeries?.(series) ?? series.label}
                class="w-full"
              />
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}
