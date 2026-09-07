<script lang="ts">
  import { sfx } from "../sfx";
  import Icon from "./Icon.svelte";

  let {
    active = false,
    disabled = false,
    label,
    hint = "",
    onclick
  }: {
    active?: boolean;
    disabled?: boolean;
    label: string;
    hint?: string;
    onclick?: () => void;
  } = $props();

  function handle(): void {
    if (!disabled) sfx.select();
    onclick?.();
  }
</script>

<button
  type="button"
  {disabled}
  aria-pressed={active}
  class="flex h-full w-full cursor-pointer flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 sm:p-5 {active
    ? 'lip border-selected bg-selected-soft [--lip:var(--selected)]'
    : 'lip press border-wire bg-surface [--lip:var(--color-wire)] hover:border-selected hover:bg-accent'}"
  onclick={handle}
>
  <span class="flex items-center gap-2.5 text-base font-bold leading-tight">
    <span
      class="grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors {active
        ? 'border-selected bg-selected text-background'
        : 'border-border'}"
      aria-hidden="true"
    >
      {#if active}
        <Icon name="check" class="size-3" />
      {/if}
    </span>
    {label}
  </span>
  {#if hint !== ""}
    <span class="pl-7.5 text-sm leading-snug text-muted-foreground">{hint}</span>
  {/if}
</button>
