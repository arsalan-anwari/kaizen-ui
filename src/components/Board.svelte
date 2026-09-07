<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    size = "md",
    guide = true,
    class: className = "",
    children
  }: { size?: "md" | "lg"; guide?: boolean; class?: string; children: Snippet } = $props();

  const sizes = {
    md: "size-[min(11rem,20dvh)] sm:size-44 lg:size-52",
    lg: "size-[min(14rem,24dvh)] sm:size-56 lg:size-64"
  };
</script>

<div
  class="@container board relative grid shrink-0 place-items-center rounded-2xl border-4 {sizes[
    size
  ]} {className}"
>
  {#if guide}
    <span
      class="board-guide pointer-events-none absolute inset-4 rounded-sm border border-dashed"
      aria-hidden="true"
    ></span>
  {/if}
  {@render children()}
</div>
