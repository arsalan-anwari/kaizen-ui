<script lang="ts">
  import type { Snippet } from "svelte";
  import IconButton from "./IconButton.svelte";
  import { FOCUSABLE } from "../keynav.svelte";
  import { lockScroll } from "../lockScroll";

  let {
    title,
    description = "",
    closeLabel = "",
    size = "md",
    onclose,
    children,
    footer
  }: {
    title: string;
    description?: string;
    closeLabel?: string;
    size?: "md" | "lg";
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
  } = $props();

  const uid = $props.id();
  const widths = { md: "max-w-md", lg: "max-w-2xl" };

  let panel = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (panel === null) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
  });

  function keydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && onclose !== undefined) {
      event.preventDefault();
      onclose();
    }
  }
</script>

<svelte:window onkeydown={keydown} />

<div
  class="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-foreground/40"
  use:lockScroll={onclose}
>
  <div class="flex min-h-full items-end justify-center p-3 sm:items-center sm:p-6">
    {#if onclose}
      <button
        type="button"
        tabindex="-1"
        class="absolute inset-0 cursor-default"
        aria-label={closeLabel}
        onclick={onclose}
      ></button>
    {/if}

    <div
      bind:this={panel}
      tabindex="-1"
      class="anim-pop sheet ruled relative flex w-full {widths[
        size
      ]} flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-5 focus:outline-none sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="{uid}-title"
      aria-describedby={description === "" ? undefined : `${uid}-description`}
    >
      <header class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-col gap-1">
          <h2 id="{uid}-title" class="text-h3 leading-tight font-bold">{title}</h2>
          {#if description !== ""}
            <p id="{uid}-description" class="text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          {/if}
        </div>
        {#if onclose}
          <IconButton icon="close" label={closeLabel} variant="ghost" size="sm" onclick={onclose} />
        {/if}
      </header>

      {#if children}
        <div class="flex flex-col gap-3">{@render children()}</div>
      {/if}

      {#if footer}
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{@render footer()}</div>
      {/if}
    </div>
  </div>
</div>
