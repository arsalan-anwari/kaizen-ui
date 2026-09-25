<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label,
    cols = 4,
    rows = 4,
    disabled = false,
    class: className = "",
    onclick,
    children
  }: {
    label: string;
    /** The block's footprint on a 4 by 4 grid, so a left half is 2 by 4. */
    cols?: number;
    rows?: number;
    disabled?: boolean;
    class?: string;
    onclick: () => void;
    children: Snippet;
  } = $props();
</script>

<button
  type="button"
  {disabled}
  aria-label={label}
  class="wood anim-lift press relative flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1 transition-transform duration-100 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-default disabled:opacity-50 {className}"
  style:width="max(2.75rem, calc(var(--block-unit, 1.25rem) * {cols}))"
  style:height="max(2.75rem, calc(var(--block-unit, 1.25rem) * {rows}))"
  {onclick}
>
  {@render children()}
</button>
