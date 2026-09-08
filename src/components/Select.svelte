<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";
  import Popover from "./Popover.svelte";
  import { sfx } from "../sfx";

  /* Replaces the native <select>: the platform popup ignores the theme, and on
     Android it draws its own arrow and row chrome on top of it. */

  type Option = { value: string; label: string };

  let {
    value = $bindable(""),
    options,
    label,
    closeLabel,
    placeholder = "",
    size = "md",
    disabled = false,
    full = false,
    class: className = "",
    onchange,
    footer
  }: {
    value?: string;
    options: Option[];
    label: string;
    closeLabel: string;
    placeholder?: string;
    size?: "sm" | "md";
    disabled?: boolean;
    full?: boolean;
    class?: string;
    onchange?: (value: string) => void;
    /** Extra rows under the options, e.g. actions on the picked value. */
    footer?: Snippet<[() => void]>;
  } = $props();

  let open = $state(false);
  let trigger = $state<HTMLButtonElement | null>(null);

  const current = $derived(options.find((option) => option.value === value));

  const sizes = {
    sm: "h-10 gap-1.5 rounded-lg px-2.5 text-xs",
    md: "h-13 gap-3 rounded-xl px-3.5 text-base"
  };

  function pick(next: string): void {
    sfx.select();
    value = next;
    onchange?.(next);
  }
</script>

<button
  type="button"
  bind:this={trigger}
  {disabled}
  aria-label={label}
  aria-haspopup="listbox"
  aria-expanded={open}
  class="lip press inline-flex cursor-pointer items-center justify-between border border-wire bg-surface font-bold text-foreground transition-colors duration-100 [--lip:var(--color-wire)] hover:border-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 {sizes[
    size
  ]} {full ? 'w-full' : ''} {className}"
  onclick={() => (open = true)}
>
  <span class="truncate">{current?.label ?? placeholder}</span>
  <Icon name="chevron-down" class="size-4 shrink-0 opacity-70" />
</button>

{#if open}
  <Popover anchor={trigger} {label} {closeLabel} onclose={() => (open = false)}>
    {#snippet children(close)}
      <div class="flex flex-col gap-1" role="listbox" aria-label={label}>
        {#each options as option (option.value)}
          <button
            type="button"
            role="option"
            aria-selected={option.value === value}
            class="flex h-11 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-left text-sm {option.value ===
            value
              ? 'bg-selected-soft font-bold text-selected'
              : 'hover:bg-accent'}"
            onclick={() => {
              pick(option.value);
              close();
            }}
          >
            <span class="truncate">{option.label}</span>
            {#if option.value === value}<Icon name="check" class="size-4 shrink-0" />{/if}
          </button>
        {/each}
      </div>

      {#if footer}
        <div class="mt-1 flex flex-col gap-1 border-t-2 border-border pt-2">
          {@render footer(close)}
        </div>
      {/if}
    {/snippet}
  </Popover>
{/if}
