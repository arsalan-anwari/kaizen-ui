<script lang="ts">
  import type { Snippet } from "svelte";
  import IconButton from "./IconButton.svelte";
  import { lockScroll } from "../lockScroll";
  import { viewport } from "../viewport.svelte";

  /* A panel hung off whatever opened it: anchored beside the trigger on a wide
     viewport, a fullscreen sheet on a phone. Both run through showModal(), so
     the top layer lifts them clear of every stacking context on the page and
     Escape closes them without a key handler here. */

  let {
    anchor,
    label,
    closeLabel,
    width = 15,
    onclose,
    children
  }: {
    anchor: HTMLElement | null;
    label: string;
    closeLabel: string;
    /** Minimum panel width in rem on a wide viewport. */
    width?: number;
    onclose: () => void;
    children: Snippet<[() => void]>;
  } = $props();

  const gap = 8;
  const edge = 8;

  let panel = $state<HTMLDialogElement | null>(null);
  let resized = $state(0);

  $effect(() => {
    panel?.showModal();
  });

  /* Placed against the viewport rather than the trigger's offset parent: the
     panel is in the top layer, where a page transform, an overflow or a sticky
     header cannot reach it. Opening upwards anchors the bottom edge, so the
     panel's own height never has to be measured. */
  const box = $derived.by(() => {
    resized;
    const rect = anchor?.getBoundingClientRect();
    if (rect === undefined) return "";

    const room = window.innerWidth - edge * 2;
    const size = Math.min(Math.max(rect.width, width * 16), room);
    const left = Math.min(Math.max(rect.left, edge), window.innerWidth - size - edge);
    const below = window.innerHeight - rect.bottom - gap - edge;
    const above = rect.top - gap - edge;

    return below >= above
      ? `left:${left}px;width:${size}px;top:${rect.bottom + gap}px;max-height:${below}px`
      : `left:${left}px;width:${size}px;bottom:${window.innerHeight - rect.top + gap}px;max-height:${above}px`;
  });

  function close(): void {
    panel?.close();
  }
</script>

<svelte:window onresize={() => (resized += 1)} />

<dialog
  bind:this={panel}
  use:lockScroll
  aria-label={label}
  {onclose}
  onclick={(event) => {
    if (event.target === panel) close();
  }}
  class={viewport.wide ? "" : "flex flex-col paper fullscreen-sheet"}
>
  {#if viewport.wide}
    <div
      class="anim-pop sheet fixed flex flex-col overflow-y-auto rounded-2xl border-2 border-border bg-surface p-3"
      style={box}
    >
      {@render children(close)}
    </div>
  {:else}
    <header class="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <span class="text-h4 font-bold">{label}</span>
      <IconButton icon="close" label={closeLabel} onclick={close} />
    </header>

    <div
      class="flex flex-1 flex-col overflow-y-auto px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]"
    >
      {@render children(close)}
    </div>
  {/if}
</dialog>
