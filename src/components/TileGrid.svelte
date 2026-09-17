<script lang="ts">
  import type { Snippet } from "svelte";
  import { roving } from "../roving";

  // A row of same-size boxes.
  //
  //   base        square
  //   extra-wide  wider than it is tall.

  let {
    size = "base",
    class: className = "",
    children
  }: { size?: "base" | "extra-wide"; class?: string; children: Snippet } = $props();
</script>

<div
  use:roving
  class="tile-grid {className}"
  style={size === "extra-wide" ? "--tile-min: 6rem; --tile-ratio: 4 / 3" : ""}
>
  {@render children()}
</div>
