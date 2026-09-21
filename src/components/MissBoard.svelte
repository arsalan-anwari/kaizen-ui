<script lang="ts">
  import type { MissSection, MissTile } from "../miss-board";
  import Badge from "./Badge.svelte";
  import EmptyState from "./EmptyState.svelte";
  import Glyph from "./Glyph.svelte";

  let {
    sections,
    empty,
    describeTile,
    lang = "ja",
    class: className = ""
  }: {
    sections: MissSection[];
    empty: string;
    describeTile?: (tile: MissTile) => string;
    lang?: string;
    class?: string;
  } = $props();
</script>

{#if sections.length === 0}
  <EmptyState icon="target" title={empty} />
{:else}
  <div class="-mb-3 columns-1 gap-3 sm:columns-2 {className}">
    {#each sections as section (section.key)}
      <div
        class="mb-3 flex break-inside-avoid flex-col gap-2 rounded-lg border-2 border-border bg-background p-3"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">{section.label}</span>
          <Badge tone="danger">{section.total}</Badge>
        </div>
        <div class="flex flex-wrap gap-1.5">
          {#each section.tiles as tile (tile.key)}
            {@const tip = describeTile?.(tile) ?? `${tile.label}: ${tile.count}`}
            <span
              role="img"
              aria-label={tip}
              title={tip}
              class="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-1"
            >
              <Glyph text={tile.label} {lang} class="text-base leading-none" />
              <span class="text-[0.625rem] font-bold leading-none text-danger tabular-nums">
                {tile.count}
              </span>
            </span>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}
