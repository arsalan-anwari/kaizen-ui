<script lang="ts">
  import type { TreeTableGroup, TreeTableRow } from "../tree-table";
  import EmptyState from "./EmptyState.svelte";
  import Icon from "./Icon.svelte";
  import Meter from "./Meter.svelte";

  let {
    groups,
    columns,
    empty,
    class: className = ""
  }: {
    groups: TreeTableGroup[];
    columns: { group: string; accuracy: string; bar: string; score: string };
    empty: string;
    class?: string;
  } = $props();

  let closed = $state(new Set<string>());

  function toggle(key: string): void {
    const next = new Set(closed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    closed = next;
  }

  function share(row: TreeTableRow): number {
    return row.total === 0 ? 0 : row.correct / row.total;
  }

  function percent(row: TreeTableRow): number {
    return Math.round(share(row) * 100);
  }
</script>

{#if groups.length === 0}
  <EmptyState icon="sprout" title={empty} />
{:else}
  <table class="w-full border-separate border-spacing-y-1 text-sm {className}">
    <thead>
      <tr class="text-left text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">
        <th class="py-1 pl-2 font-bold">{columns.group}</th>
        <th class="py-1 px-2 text-right font-bold">{columns.accuracy}</th>
        <th class="hidden py-1 px-2 font-bold sm:table-cell">{columns.bar}</th>
        <th class="py-1 pr-2 text-right font-bold">{columns.score}</th>
      </tr>
    </thead>
    <tbody>
      {#each groups as group (group.key)}
        <tr class="bg-surface">
          <td class="rounded-l-lg py-2 pl-2">
            <button
              type="button"
              class="flex cursor-pointer items-center gap-1.5 font-bold"
              aria-expanded={!closed.has(group.key)}
              onclick={() => toggle(group.key)}
            >
              <Icon
                name={!closed.has(group.key) ? "chevron-down" : "chevron-right"}
                class="size-3.5 shrink-0"
              />
              {group.label}
            </button>
          </td>
          <td class="px-2 py-2 text-right tabular-nums">{percent(group)}%</td>
          <td class="hidden px-2 py-2 sm:table-cell">
            <Meter value={share(group)} tone="heat" size="sm" showValue={false} />
          </td>
          <td class="rounded-r-lg py-2 pr-2 text-right tabular-nums text-muted-foreground">
            {group.correct}/{group.total}
          </td>
        </tr>
        {#if !closed.has(group.key)}
          {#each group.children as child (child.key)}
            <tr>
              <td class="py-1.5 pl-6 text-muted-foreground">
                <span class="flex items-center gap-1.5">
                  <span class="size-1 shrink-0 rounded-full bg-muted-foreground"></span>
                  {child.label}
                </span>
              </td>
              <td class="px-2 py-1.5 text-right text-xs tabular-nums">{percent(child)}%</td>
              <td class="hidden px-2 py-1.5 sm:table-cell">
                <Meter value={share(child)} tone="heat" size="sm" showValue={false} />
              </td>
              <td class="py-1.5 pr-2 text-right text-xs tabular-nums text-muted-foreground">
                {child.correct}/{child.total}
              </td>
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>
{/if}
