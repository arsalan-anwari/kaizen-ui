<script lang="ts">
  import { heatFill } from "../heat";
  import type { HeatCell, HeatRow, MasteryLabels } from "../mastery";
  import Glyph from "./Glyph.svelte";
  import HeatLegend from "./HeatLegend.svelte";

  let {
    rows,
    labels,
    describeCell,
    describeRow,
    empty,
    lang = "ja"
  }: {
    rows: HeatRow[];
    labels: MasteryLabels;
    describeCell: (cell: HeatCell) => string;
    describeRow: (row: HeatRow) => string;
    empty: string;
    lang?: string;
  } = $props();
</script>

{#if rows.length === 0}
  <p class="py-6 text-center text-sm text-muted-foreground">{empty}</p>
{:else}
  <div class="flex flex-col gap-3">
    <div class="flex max-w-3xl flex-col gap-1.5">
      {#each rows as row (row.id)}
        <div class="flex items-center gap-2">
          <span
            class="w-11 shrink-0 truncate text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground sm:w-16"
          >
            {row.label}
          </span>
          <div class="flex min-w-0 flex-1 flex-wrap gap-1">
            {#each row.cells as cell (cell.key)}
              <span
                role="img"
                aria-label={describeCell(cell)}
                title={describeCell(cell)}
                class="grid h-7 min-w-7 place-items-center rounded-lg border-2 border-border px-1 sm:h-8 sm:min-w-8"
                class:opacity-35={cell.total === 0}
                style={cell.total === 0 ? "" : `background: ${heatFill(cell.strength, 34)}`}
              >
                <Glyph text={cell.glyph} {lang} class="whitespace-nowrap text-sm leading-none" />
              </span>
            {/each}
          </div>
          <span
            role="img"
            aria-label={describeRow(row)}
            title={describeRow(row)}
            class="w-12 shrink-0 text-right text-xs font-bold leading-none tabular-nums"
          >
            {row.correct}/{row.total}
          </span>
        </div>
      {/each}
    </div>
    <HeatLegend {labels} />
  </div>
{/if}
