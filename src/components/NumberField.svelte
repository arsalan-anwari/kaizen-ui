<script lang="ts">
  import { untrack } from "svelte";

  let {
    value,
    min,
    max,
    label,
    unit = "",
    focusOnMount = false,
    class: className = "",
    oncommit
  }: {
    value: number;
    min: number;
    max: number;
    label: string;
    unit?: string;
    focusOnMount?: boolean;
    class?: string;
    oncommit: (value: number) => void;
  } = $props();

  let element = $state<HTMLInputElement | null>(null);
  let draft = $state(untrack(() => String(value)));

  $effect(() => {
    draft = String(value);
  });

  $effect(() => {
    if (focusOnMount && element !== null) element.select();
  });

  function clamp(raw: number): number {
    if (!Number.isFinite(raw)) return min;
    return Math.min(max, Math.max(min, Math.round(raw)));
  }

  function commit(): void {
    const next = clamp(Number(draft));
    draft = String(next);
    oncommit(next);
  }

  function keydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      element?.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      draft = String(value);
      element?.blur();
    }
  }
</script>

<label
  class="lip inline-flex h-10 min-w-10 cursor-text items-center justify-center gap-1 rounded-lg border border-selected bg-selected-soft px-3.5 text-sm font-bold text-selected [--lip:var(--selected)] focus-within:ring-2 focus-within:ring-ring {className}"
>
  <input
    bind:this={element}
    bind:value={draft}
    type="text"
    inputmode="numeric"
    autocomplete="off"
    aria-label={label}
    onkeydown={keydown}
    onblur={commit}
    class="w-10 min-w-0 bg-transparent text-center tabular-nums outline-none"
  />
  {#if unit !== ""}<span aria-hidden="true">{unit}</span>{/if}
</label>
