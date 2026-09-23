<script lang="ts">
  import type { Snippet } from "svelte";
  import Board from "./Board.svelte";

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
</script>

<div class="relative inline-grid place-items-center">
  <div
    class="projector-housing absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3"
    aria-hidden="true"
  >
    <span class="projector-lens absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></span>
  </div>
  <Board {size} {guide} {compact} class="projector-screen {className}">
    <div
      class="projector-beam pointer-events-none absolute inset-x-0 top-0"
      aria-hidden="true"
    ></div>
    {@render children()}
  </Board>
</div>
