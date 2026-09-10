<script lang="ts">
  import type { Snippet } from "svelte";
  import IconButton from "./IconButton.svelte";
  import { lockScroll } from "../lockScroll";
  import { viewport } from "../viewport.svelte";

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
  const room = 160;

  let panel = $state<HTMLDialogElement | null>(null);
  let resized = $state(0);

  $effect(() => {
    panel?.showModal();
  });

  const box = $derived.by(() => {
    resized;
    const rect = anchor?.getBoundingClientRect();
    if (rect === undefined) return null;

    const below = window.innerHeight - rect.bottom - gap - edge;
    if (below < room) return null;

    const span = window.innerWidth - edge * 2;
    const size = Math.min(Math.max(rect.width, width * 16), span);
    const left = Math.min(Math.max(rect.left, edge), window.innerWidth - size - edge);

    return `left:${left}px;width:${size}px;top:${rect.bottom + gap}px;max-height:calc(${below}px - var(--nav-bar))`;
  });

  const anchored = $derived(viewport.wide && box !== null);

  function close(): void {
    panel?.close();
  }
</script>

<svelte:window onresize={() => (resized += 1)} />

<dialog
  bind:this={panel}
  use:lockScroll={close}
  aria-label={label}
  {onclose}
  onclick={(event) => {
    if (event.target === panel) close();
  }}
  class={anchored ? "" : "flex flex-col paper fullscreen-sheet"}
>
  {#if anchored}
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
      class="flex flex-1 flex-col overflow-y-auto px-4 pt-4 pb-[calc(var(--nav-bar)+1.25rem)]"
    >
      {@render children(close)}
    </div>
  {/if}
</dialog>
