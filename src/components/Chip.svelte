<script lang="ts">
  import type { Snippet } from "svelte";
  import { sfx } from "../sfx";

  let {
    active = false,
    disabled = false,
    size = "md",
    title = "",
    class: className = "",
    onclick,
    children
  }: {
    active?: boolean;
    disabled?: boolean;
    size?: "sm" | "md";
    title?: string;
    class?: string;
    onclick?: () => void;
    children: Snippet;
  } = $props();

  const sizes = {
    sm: "h-10 min-w-10 px-3.5 text-sm rounded-lg",
    md: "h-13 min-w-13 px-3 text-base rounded-xl"
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
  aria-pressed={active}
  class="inline-flex cursor-pointer items-center justify-center gap-1.5 font-bold transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30 {sizes[
    size
  ]} {className} {active
    ? 'lip border border-selected bg-selected-soft text-selected [--lip:var(--selected)]'
    : 'lip press border border-wire bg-surface text-foreground [--lip:var(--color-wire)] hover:border-selected'}"
  onclick={handle}
>
  {@render children()}
</button>
