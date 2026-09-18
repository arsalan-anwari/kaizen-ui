<script lang="ts">
  import { roving } from "../roving";
  import Announcer from "./Announcer.svelte";
  import Chip from "./Chip.svelte";
  import IconButton from "./IconButton.svelte";

  let {
    page = $bindable(1),
    pages,
    label,
    previousLabel,
    nextLabel,
    describe,
    class: className = "",
    onpick
  }: {
    page?: number;
    pages: number;
    label: string;
    previousLabel: string;
    nextLabel: string;
    describe: (page: number, pages: number) => string;
    class?: string;
    onpick?: (page: number) => void;
  } = $props();

  let announce = $state("");
  let width = $state(0);

  const near = $derived(width >= 380 ? 1 : 0);

  const slots = $derived.by(() => {
    const out: (number | null)[] = [1];
    const from = Math.max(2, page - near);
    const to = Math.min(pages - 1, page + near);
    if (from > 2) out.push(null);
    for (let at = from; at <= to; at += 1) out.push(at);
    if (to < pages - 1) out.push(null);
    if (pages > 1) out.push(pages);
    return out;
  });

  function go(to: number): void {
    const next = Math.max(1, Math.min(pages, to));
    if (next === page) return;
    page = next;
    announce = describe(next, pages);
    onpick?.(next);
  }

  $effect(() => {
    if (page > pages) go(pages);
  });
</script>

{#if pages > 1}
  <nav
    aria-label={label}
    use:roving={{}}
    bind:clientWidth={width}
    class="flex flex-wrap items-center justify-center gap-1.5 {className}"
  >
    <IconButton
      size="sm"
      variant="ghost"
      icon="chevron-left"
      label={previousLabel}
      disabled={page <= 1}
      onclick={() => go(page - 1)}
    />

    {#each slots as slot, index (index)}
      {#if slot === null}
        <span aria-hidden="true" class="px-1 text-sm text-muted-foreground">…</span>
      {:else}
        <Chip
          size="sm"
          class="tabular-nums"
          current={slot === page}
          title={describe(slot, pages)}
          onclick={() => go(slot)}
        >
          {slot}
        </Chip>
      {/if}
    {/each}

    <IconButton
      size="sm"
      variant="ghost"
      icon="chevron-right"
      label={nextLabel}
      disabled={page >= pages}
      onclick={() => go(page + 1)}
    />

    <Announcer message={announce} />
  </nav>
{/if}
