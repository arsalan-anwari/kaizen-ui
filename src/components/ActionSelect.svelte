<script lang="ts">
  import type { IconName } from "./icons";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";
  import { lockScroll } from "../lockScroll";
  import { viewport } from "../viewport.svelte";

  type Action = { icon: IconName; label: string; disabled?: boolean; onclick: () => void };

  let {
    value = $bindable(""),
    options,
    label,
    empty,
    closeLabel,
    actions,
    onchange
  }: {
    value?: string;
    options: string[];
    label: string;
    empty: string;
    closeLabel: string;
    actions: Action[];
    onchange?: (value: string) => void;
  } = $props();

  let open = $state(false);
  let panel = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    panel?.showModal();
  });

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
    <dialog
      bind:this={panel}
      class="fixed inset-0 z-50 flex flex-col paper pt-[calc(env(safe-area-inset-top,0px)+var(--edge-y,0.75rem))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]"
      use:lockScroll
      aria-label={label}
      onclose={() => (open = false)}
    >
      <header class="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span class="text-h4 font-bold">{label}</span>
        <IconButton icon="close" label={closeLabel} onclick={() => (open = false)} />
      </header>

      <div
        class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]"
      >
        <button
          type="button"
          class="flex h-11 shrink-0 items-center rounded-lg px-3 text-left text-sm {value === ''
            ? 'bg-secondary font-bold'
            : ''}"
          onclick={() => pick("")}
        >
          {empty}
        </button>

        {#each options as option (option)}
          <button
            type="button"
            class="flex h-11 shrink-0 items-center justify-between rounded-lg px-3 text-left text-sm {option ===
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
              class="flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold disabled:opacity-40"
              disabled={action.disabled === true}
              onclick={() => run(action)}
            >
              <Icon name={action.icon} class="size-5" />
              {action.label}
            </button>
          {/each}
        </div>
      </div>
    </dialog>
  {/if}
{/if}
