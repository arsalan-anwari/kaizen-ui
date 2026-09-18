<script lang="ts">
  import IconButton from "./IconButton.svelte";
  import { lockScroll } from "../lockScroll";

  let {
    title,
    closeLabel,
    groups,
    onclose
  }: {
    title: string;
    closeLabel: string;
    groups: { title: string; items: { keys: string[]; label: string }[] }[];
    onclose: () => void;
  } = $props();

  let panel = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    panel?.showModal();
  });

  function close(): void {
    panel?.close();
  }
</script>

<dialog
  bind:this={panel}
  use:lockScroll={close}
  aria-label={title}
  {onclose}
  onclick={(event) => {
    if (event.target === panel) close();
  }}
  class="dim grid place-items-center p-4"
>
  <div
    class="anim-pop sheet flex max-h-[80dvh] w-full max-w-[24rem] flex-col rounded-2xl border-2 border-border bg-surface"
  >
    <header class="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
      <span class="text-sm font-bold">{title}</span>
      <IconButton icon="close" label={closeLabel} onclick={close} />
    </header>

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      tabindex="0"
      role="region"
      aria-label={title}
      class="flex flex-col overflow-y-auto px-4 pb-3 focus-visible:outline-offset-[-3px]"
    >
      {#each groups as group (group.title)}
        <p class="pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {group.title}
        </p>
        <dl class="flex flex-col">
          {#each group.items as item (item.label)}
            <div
              class="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0"
            >
              <dt class="flex shrink-0 flex-wrap items-center gap-1">
                {#each item.keys as key (key)}
                  <kbd
                    class="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-xs font-bold"
                  >
                    {key}
                  </kbd>
                {/each}
              </dt>
              <dd class="min-w-0 flex-1 text-right text-xs">{item.label}</dd>
            </div>
          {/each}
        </dl>
      {/each}
    </div>
  </div>
</dialog>
