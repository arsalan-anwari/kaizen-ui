<script lang="ts">
  let {
    strokes,
    viewBox = "0 0 109 109",
    label = "",
    class: className = ""
  }: {
    /** SVG path data, one entry per brush stroke. */
    strokes: readonly string[];
    viewBox?: string;
    label?: string;
    class?: string;
  } = $props();
</script>

<svg
  {viewBox}
  class={className}
  role={label === "" ? undefined : "img"}
  aria-label={label === "" ? undefined : label}
  aria-hidden={label === "" ? "true" : undefined}
  preserveAspectRatio="xMidYMid meet"
  fill="none"
  stroke="currentColor"
  stroke-width="5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#each strokes as d, index (index)}
    <path {d} />
  {/each}
</svg>
