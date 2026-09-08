<script lang="ts">
  import type { IconName } from "./icons";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";
  import { viewport } from "../viewport.svelte";

  type Action = { icon: IconName; label: string; disabled?: boolean; onclick: () => void };

  let {
    value = $bindable(""),
    options,
    label,
    empty,
    actions,
    onchange
  }: {
    value?: string;
    options: string[];
    label: string;
    empty: string;
    actions: Action[];
    onchange?: (value: string) => void;
  } = $props();

  let open = $state(false);

  function pick(next: string): void {
    value = next;
    open = false;
    onchange?.(next);
  }

  function run(action: Action): void {
    open = false;
    action.onclick();
  }
</script>

{#if viewport.wide}
  <select
    {value}
    onchange={(event) => pick(event.currentTarget.value)}
    aria-label={label}
    disabled={options.length === 0}
    class="h-9 min-w-32 cursor-pointer rounded-md border border-border bg-surface px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
  >
    <option value="">{empty}</option>
    {#each options as option (option)}
      <option value={option}>{option}</option>
    {/each}
  </select>

  {#each actions as action (action.label)}
    <IconButton
      icon={action.icon}
      size="sm"
      label={action.label}
      disabled={action.disabled === true}
      onclick={action.onclick}
    />
  {/each}
{:else}
  <button
    type="button"
    class="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label={label}
    aria-haspopup="menu"
    onclick={() => (open = true)}
  >
    <span class="truncate">{value === "" ? empty : value}</span>
    <Icon name="chevron-down" class="size-4 shrink-0" />
  </button>

  {#if open}
    <div class="fixed inset-0 z-50 flex items-end" role="menu" tabindex="-1">
      <button
        type="button"
        class="absolute inset-0 cursor-default bg-foreground/40"
        aria-label={label}
        onclick={() => (open = false)}
      ></button>

      <div class="sheet anim-pop relative flex max-h-[75dvh] w-full flex-col gap-2 overflow-y-auto rounded-t-2xl border-t-2 border-border bg-surface p-3 pb-6">
        <span class="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>

        <button
          type="button"
          class="flex h-11 items-center rounded-lg px-3 text-left text-sm {value === ''
            ? 'bg-secondary font-bold'
            : ''}"
          onclick={() => pick("")}
        >
          {empty}
        </button>

        {#each options as option (option)}
          <button
            type="button"
            class="flex h-11 items-center justify-between rounded-lg px-3 text-left text-sm {option ===
            value
              ? 'bg-secondary font-bold'
              : ''}"
            onclick={() => pick(option)}
          >
            <span class="truncate">{option}</span>
            {#if option === value}<Icon name="check" class="size-4" />{/if}
          </button>
        {/each}

        <div class="mt-1 flex flex-col gap-1 border-t-2 border-border pt-2">
          {#each actions as action (action.label)}
            <button
              type="button"
              class="flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold disabled:opacity-40"
              disabled={action.disabled === true}
              onclick={() => run(action)}
            >
              <Icon name={action.icon} class="size-5" />
              {action.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/if}
