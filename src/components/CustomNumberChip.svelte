<script lang="ts">
  import { viewport } from "../viewport.svelte";
  import Chip from "./Chip.svelte";
  import Icon from "./Icon.svelte";
  import NumberRoller from "./NumberRoller.svelte";

  let {
    value,
    min,
    max,
    unit = "",
    title,
    doneLabel,
    cancelLabel,
    active = false,
    onpick
  }: {
    value: number;
    min: number;
    max: number;
    unit?: string;
    title: string;
    doneLabel: string;
    cancelLabel: string;
    active?: boolean;
    onpick: (value: number) => void;
  } = $props();

  const values = $derived(Array.from({ length: max - min + 1 }, (_, index) => min + index));

  let rolling = $state(false);

  function clamp(raw: number): number {
    if (!Number.isFinite(raw)) return min;
    return Math.min(max, Math.max(min, Math.round(raw)));
  }

  const start = $derived(clamp(value > 0 ? value : min));

  function open(): void {
    if (viewport.touch) {
      rolling = true;
      return;
    }
    onpick(start);
  }

  function commit(event: Event & { currentTarget: HTMLInputElement }): void {
    const next = clamp(Number(event.currentTarget.value));

    event.currentTarget.value = String(next);
    onpick(next);
  }

  function picked(next: number): void {
    rolling = false;
    onpick(next);
  }
</script>

{#if active && !viewport.touch}
  <label
    class="flex h-9 items-center gap-1 rounded-lg border-2 border-selected bg-selected-soft px-2 text-xs font-bold text-selected"
  >
    <span class="sr-only">{title}</span>
    <input
      type="number"
      inputmode="numeric"
      {min}
      {max}
      {value}
      onchange={commit}
      onblur={commit}
      class="w-10 min-w-0 bg-transparent text-center tabular-nums outline-none"
    />
    <span aria-hidden="true">{unit}</span>
  </label>
{:else}
  <Chip size="sm" {active} {title} onclick={open}>
    {#if active}
      {value}{unit}
    {:else}
      <Icon name="sliders" />
      <span class="sr-only">{title}</span>
    {/if}
  </Chip>
{/if}

{#if rolling}
  <NumberRoller
    {values}
    value={start}
    {title}
    {doneLabel}
    {cancelLabel}
    onpick={picked}
    onclose={() => (rolling = false)}
  />
{/if}
