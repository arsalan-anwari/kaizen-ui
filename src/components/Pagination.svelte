<script lang="ts">
  import { roving } from "../roving";
  import Announcer from "./Announcer.svelte";
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
    class="flex items-center justify-center gap-2 {className}"
  >
    <IconButton
      size="sm"
      variant="ghost"
      icon="chevron-left"
      label={previousLabel}
      disabled={page <= 1}
      onclick={() => go(page - 1)}
    />

    <span class="text-sm tabular-nums text-muted-foreground" title={describe(page, pages)}>
      {page} / {pages}
    </span>

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
