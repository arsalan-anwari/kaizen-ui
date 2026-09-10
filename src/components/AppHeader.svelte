<script lang="ts" generics="T extends string">
  import type { Snippet } from "svelte";
  import AppControls from "./AppControls.svelte";
  import AppMark from "./AppMark.svelte";
  import IconButton from "./IconButton.svelte";
  import Segmented from "./Segmented.svelte";


  let {
    glyph,
    title,
    subtitle = "",
    tone = "ink",
    items = [],
    value,
    onpick,
    settingsLabel = "",
    onsettings,
    sticky = true,
    width = "max-w-[80rem]",
    class: className = "",
    controls
  }: {
    glyph: string;
    title: string;
    subtitle?: string;
    tone?: "ink" | "seal";
    items?: { value: T; label: string }[];
    value?: T;
    onpick?: (value: T) => void;
    settingsLabel?: string;
    onsettings?: () => void;
    /** Off when the page already provides its own bar for this to sit in. */
    sticky?: boolean;
    /** How wide the bar's content runs before it centres. */
    width?: string;
    class?: string;
    /** Replaces the default AppControls cluster. */
    controls?: Snippet;
  } = $props();

  const tabs = $derived(value === undefined || onpick === undefined ? [] : items);
</script>


{#snippet bar()}
  <header
    class="flex flex-col gap-3 @min-[73rem]:flex-row @min-[73rem]:items-center @min-[73rem]:justify-between"
  >
    <div class="flex items-center gap-3">
      <AppMark {glyph} {tone} class="size-10 shrink-0 text-h3 @min-[73rem]:size-11" />
      <div class="flex flex-col">
        <span class="text-h4 font-bold leading-tight">{title}</span>
        {#if subtitle !== ""}
          <span class="text-xs text-muted-foreground">{subtitle}</span>
        {/if}
      </div>

      {#if onsettings !== undefined}
        <IconButton
          class="ml-auto @min-[73rem]:hidden"
          icon="sliders"
          label={settingsLabel}
          onclick={onsettings}
        />
      {/if}
    </div>

    <nav class="items-center gap-2 {tabs.length > 0 ? 'flex' : 'hidden @min-[73rem]:flex'}">
      {#if tabs.length > 0}
        <Segmented
          full
          class="flex-1 @min-[73rem]:flex-none"
          items={tabs}
          value={value as T}
          onpick={onpick as (value: T) => void}
        />
      {/if}

      <span
        class="hidden items-center @min-[73rem]:flex {tabs.length > 0
          ? 'ml-3 border-l border-border pl-3 @min-[73rem]:ml-4 @min-[73rem]:pl-4'
          : ''}"
      >
        {#if controls === undefined}
          <AppControls />
        {:else}
          {@render controls()}
        {/if}
      </span>
    </nav>
  </header>
{/snippet}

{#if sticky}
  <div
    class="scrim sticky top-0 z-20 w-full px-[var(--edge-x,1rem)] pt-[calc(var(--status-bar)+var(--edge-y,0.75rem))] pb-8 sm:px-[var(--edge-x,1.5rem)] sm:pb-10 {className}"
  >
    <div class="@container mx-auto w-full {width}">
      {@render bar()}
    </div>
  </div>
{:else}
  <div class="@container w-full {className}">
    {@render bar()}
  </div>
{/if}
