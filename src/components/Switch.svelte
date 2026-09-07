<script lang="ts">
  import { sfx } from "../sfx";

  let {
    checked = false,
    disabled = false,
    label = "",
    hint = "",
    onchange
  }: {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    hint?: string;
    onchange?: (value: boolean) => void;
  } = $props();

  function toggle(): void {
    if (disabled) return;
    sfx.select();
    onchange?.(!checked);
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  {disabled}
  class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border-2 px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 {checked
    ? 'border-selected bg-selected-soft'
    : 'border-wire bg-surface hover:bg-accent'}"
  onclick={toggle}
>
  <span class="flex flex-col gap-0.5">
    <span class="text-base font-bold leading-tight">{label}</span>
    {#if hint !== ""}
      <span class="text-sm leading-snug text-muted-foreground">{hint}</span>
    {/if}
  </span>
  <span
    class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors {checked
      ? 'border-selected bg-selected'
      : 'border-border bg-secondary'}"
  >
    <span
      class="absolute size-4 rounded-full transition-transform duration-150 {checked
        ? 'translate-x-[26px] bg-background'
        : 'translate-x-[4px] bg-muted-foreground'}"
    ></span>
  </span>
</button>
