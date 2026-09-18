<script lang="ts">
  import type { Snippet } from "svelte";
  import { sfx } from "../sfx";

  let {
    active = false,
    current = undefined,
    disabled = false,
    size = "md",
    title = "",
    class: className = "",
    onclick,
    children
  }: {
    active?: boolean;
    current?: boolean;
    disabled?: boolean;
    size?: "sm" | "md";
    title?: string;
    class?: string;
    onclick?: () => void;
    children: Snippet;
  } = $props();

  const on = $derived(active || current === true);

  const sizes = {
    sm: "h-10 min-w-10 px-3.5 text-sm rounded-lg",
    // Wide enough for two full-width glyphs (2em at text-base) plus padding.
    md: "h-13 min-w-15 px-2 text-base rounded-xl"
  };

  function handle(): void {
    if (!disabled) sfx.select();
    onclick?.();
  }
</script>

<button
  type="button"
  {title}
  {disabled}
  aria-pressed={current === undefined ? active : undefined}
  aria-current={current === true ? "page" : undefined}
  class="inline-flex cursor-pointer items-center justify-center gap-1.5 font-bold transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30 {sizes[
    size
  ]} {className} {on
    ? 'lip border border-selected bg-selected-soft text-selected [--lip:var(--selected)]'
    : 'lip press border border-wire bg-surface text-foreground [--lip:var(--color-wire)] hover:border-selected'}"
  onclick={handle}
>
  {@render children()}
</button>
