<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    size = "md",
    guide = true,
    compact = false,
    class: className = "",
    children
  }: {
    size?: "md" | "lg";
    guide?: boolean;
    compact?: boolean;
    class?: string;
    children: Snippet;
  } = $props();

  const sizes = {
    md: "size-[min(11rem,20dvh)] sm:size-44 lg:size-52",
    lg: "size-[min(14rem,24dvh)] sm:size-56 lg:size-64"
  };

  const compacts = {
    md: "h-[min(5.5rem,11dvh)] w-[min(16rem,74vw)] sm:h-44 sm:w-44 lg:h-52 lg:w-52",
    lg: "h-[min(7rem,13dvh)] w-[min(18rem,82vw)] sm:h-56 sm:w-56 lg:h-64 lg:w-64"
  };
</script>

<div
  class="board relative grid shrink-0 place-items-center rounded-2xl border-4 [container-type:size] {(compact
    ? compacts
    : sizes)[size]} {className}"
>
  {#if guide}
    <span
      class="board-guide pointer-events-none absolute inset-4 rounded-sm border border-dashed"
      aria-hidden="true"
    ></span>
  {/if}
  {@render children()}
</div>
