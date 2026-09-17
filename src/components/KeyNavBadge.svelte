<script lang="ts">
  import Icon from "./Icon.svelte";
  import { keynav } from "../keynav.svelte";

  let { label }: { label: string } = $props();
</script>

{#if keynav.active}
  <div
    class="pointer-events-none fixed left-3 top-[calc(var(--status-bar)+0.75rem)] z-60 flex items-center gap-1.5 rounded-full border-2 border-[var(--focus)] bg-surface px-2.5 py-1 text-xs font-bold shadow"
  >
    <Icon name="keyboard" class="size-4 text-[var(--focus)]" />
    {label}
  </div>
{/if}
