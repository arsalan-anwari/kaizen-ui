<script lang="ts">
  import type { Snippet } from "svelte";
  import type { TrayCell } from "../wood-tray";

  let {
    cells,
    label,
    done = false,
    class: className = "",
    onslot,
    cell,
    glyph
  }: {
    cells: readonly TrayCell[];
    label: string;
    /**
     * Every slot holds the right block; the pieces give way to the finished
     * glyph. The slots stay pressable over it, so a block can still come out.
     */
    done?: boolean;
    class?: string;
    onslot: (index: number) => void;
    /** What a filled slot shows, and what a ghosted one hints at. */
    cell: Snippet<[number]>;
    glyph: Snippet;
  } = $props();

  // Bigger slots first, so an enclosure's inner slot stays on top of it.
  const order = $derived(
    cells
      .map((entry, index) => ({ index, area: entry.rect[2] * entry.rect[3] }))
      .sort((a, b) => b.area - a.area)
      .map((entry) => entry.index)
  );

  const quarter = (value: number): string => `${value * 25}%`;
</script>

<div
  role="group"
  aria-label={label}
  class="wood-tray relative aspect-square shrink-0 rounded-xl p-2 {className}"
>
  <div class="relative size-full">
    {#if done}
      <div
        class="anim-glyph wood pointer-events-none absolute inset-0 flex items-center justify-center rounded-md"
      >
        {@render glyph()}
      </div>
    {/if}
    {#each order as index (index)}
      {@const slot = cells[index]}
      <button
        type="button"
        data-slot
        aria-label={slot.label}
        aria-current={slot.selected === true ? "true" : undefined}
        class="absolute cursor-pointer rounded-md p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none {slot.selected ===
        true
          ? 'ring-2 ring-ring ring-offset-1 ring-offset-transparent'
          : ''}"
        style:left={quarter(slot.rect[0])}
        style:top={quarter(slot.rect[1])}
        style:width={quarter(slot.rect[2])}
        style:height={quarter(slot.rect[3])}
        onclick={() => onslot(index)}
      >
        <span class="fade-swap block size-full" style:opacity={done ? 0 : 1}>
          {#if slot.filled}
            <span class="wood anim-drop flex size-full items-center justify-center rounded-md">
              {@render cell(index)}
            </span>
          {:else}
            <span class="wood-slot flex size-full items-center justify-center rounded-md">
              {#if slot.ghost === true}
                <span
                  class="flex size-full items-center justify-center text-[var(--wood-slot-line)] opacity-60"
                >
                  {@render cell(index)}
                </span>
              {/if}
            </span>
          {/if}
        </span>
      </button>
    {/each}
  </div>
</div>
