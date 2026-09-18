<script lang="ts">
  import { Pagination } from "kaizen-ui";

  const items = Array.from({ length: 96 }, (_, index) => `Run ${index + 1}`);
  const perPage = 8;
  const pages = Math.ceil(items.length / perPage);

  let page = $state(1);

  const shown = $derived(items.slice((page - 1) * perPage, page * perPage));
</script>

<div class="flex w-full flex-col gap-3">
  <ul class="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
    {#each shown as item (item)}
      <li class="rounded-lg border-2 border-border bg-surface px-3 py-2 text-sm">{item}</li>
    {/each}
  </ul>

  <Pagination
    bind:page
    {pages}
    label="Runs"
    previousLabel="Previous page"
    nextLabel="Next page"
    describe={(at, total) => `Page ${at} of ${total}`}
  />
</div>
