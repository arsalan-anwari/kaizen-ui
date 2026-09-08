<script lang="ts">
  import type { IconName } from "./icons";
  import IconButton from "./IconButton.svelte";
  import Select from "./Select.svelte";
  import Icon from "./Icon.svelte";
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

  const choices = $derived([
    { value: "", label: empty },
    ...options.map((option) => ({ value: option, label: option }))
  ]);
</script>

{#if viewport.wide}
  <div class="flex w-full items-center gap-1.5">
    <Select
      bind:value
      options={choices}
      {label}
      {closeLabel}
      placeholder={empty}
      size="sm"
      class="min-w-0 flex-1"
      disabled={options.length === 0}
      {onchange}
    />

    {#each actions as action (action.label)}
      <IconButton
        icon={action.icon}
        size="sm"
        label={action.label}
        disabled={action.disabled === true}
        onclick={action.onclick}
      />
    {/each}
  </div>
{:else}
  <!-- A phone has no room for the select and four buttons side by side, so the
       actions ride along in the sheet the select already opens. -->
  <Select
    bind:value
    options={choices}
    {label}
    {closeLabel}
    placeholder={empty}
    full
    {onchange}
  >
    {#snippet footer(close)}
      {#each actions as action (action.label)}
        <button
          type="button"
          class="flex h-11 shrink-0 cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold disabled:opacity-40"
          disabled={action.disabled === true}
          onclick={() => {
            close();
            action.onclick();
          }}
        >
          <Icon name={action.icon} class="size-5" />
          {action.label}
        </button>
      {/each}
    {/snippet}
  </Select>
{/if}
