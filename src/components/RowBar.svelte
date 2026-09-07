<script lang="ts">
  import type { Snippet } from "svelte";
  import { sfx } from "../sfx";
  import Icon from "./Icon.svelte";

  // A full width bar with its own action and a separate open button on the right.

  let {
    label,
    hint = "",
    active = false,
    open = $bindable(false),
    expandLabel,
    collapseLabel,
    onpress,
    children
  }: {
    label: string;
    hint?: string;
    active?: boolean;
    open?: boolean;
    expandLabel?: string;
    collapseLabel?: string;
    // what tapping the bar does, defaults to opening and closing it
    onpress?: () => void;
    children: Snippet;
  } = $props();

  function press(): void {
    if (onpress === undefined) {
      toggle();
      return;
    }
    onpress();
  }

  function toggle(): void {
    sfx.click();
    open = !open;
  }
</script>

<div
  class="overflow-hidden rounded-xl border-2 transition-colors {active
    ? 'border-selected bg-selected-soft'
    : 'border-wire bg-surface'}"
>
  <div class="flex items-stretch">
    <button
      type="button"
      aria-pressed={onpress === undefined ? undefined : active}
      class="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onclick={press}
    >
      <span class="text-base font-bold tracking-tight">{label}</span>
      {#if hint !== ""}
        <span class="truncate text-sm tabular-nums text-muted-foreground">{hint}</span>
      {/if}
    </button>
    <button
      type="button"
      aria-expanded={open}
      aria-label={(open ? collapseLabel : expandLabel) ?? label}
      class="flex w-12 shrink-0 cursor-pointer items-center justify-center border-l-2 border-wire text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onclick={toggle}
    >
      <Icon name="chevron-down" class="size-4 transition-transform {open ? 'rotate-180' : ''}" />
    </button>
  </div>

  {#if open}
    <div class="border-t-2 border-border p-2">
      {@render children()}
    </div>
  {/if}
</div>
