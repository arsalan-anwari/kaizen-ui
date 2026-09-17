<script lang="ts">
  import { Button, keynav } from "kaizen-ui";
</script>

<div class="flex flex-col gap-3">
  <div class="flex flex-wrap gap-2">
    <Button size="sm" variant="outline" onclick={() => keynav.set(!keynav.active)}>
      {keynav.active ? "Stop keyboard mode" : "Start keyboard mode"}
    </Button>
    <Button size="sm" variant="outline" onclick={() => (keynav.help = true)}>
      Shortcut menu
    </Button>
  </div>

  {#if keynav.available}
    <p class="text-sm text-foreground/75">
      Same as <kbd class="font-bold">Ctrl</kbd> + <kbd class="font-bold">/</kbd> anywhere on this
      page, and <kbd class="font-bold">?</kbd> opens the menu. While it runs, the badge at the top
      left is <code>KeyNavBadge</code>: <kbd class="font-bold">Shift</kbd> +
      <kbd class="font-bold">↑↓</kbd> walks the groups of this page, <kbd class="font-bold">Tab</kbd>
      cycles inside the group it stopped in, <kbd class="font-bold">↑↓</kbd> jumps to its first or
      last control, <kbd class="font-bold">Ctrl</kbd> + <kbd class="font-bold">↑↓</kbd> scrolls and
      <kbd class="font-bold">Ctrl</kbd> + <kbd class="font-bold">←→</kbd> pages the header tabs.
    </p>
  {:else}
    <p class="text-sm text-foreground/75">
      This is a touch screen, so <code>keynav.available</code> is false and the mode stays off.
      Open the page on a desktop to try it.
    </p>
  {/if}
</div>
