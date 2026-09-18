<script lang="ts">
  import { Button, focusMain } from "kaizen-ui";

  let route = $state("setup");

  // Moves focus into the panel whenever the route changes, never on first paint.
  $effect(() => focusMain(route, "demo-main"));
</script>

<div class="flex flex-col gap-3">
  <div class="flex flex-wrap gap-2">
    {#each ["setup", "quiz", "report"] as name (name)}
      <Button
        size="sm"
        variant={route === name ? "primary" : "outline"}
        onclick={() => (route = name)}
      >
        {name}
      </Button>
    {/each}
  </div>

  <div
    id="demo-main"
    tabindex="-1"
    class="rounded-xl border-2 border-border p-4 text-sm focus:outline-none"
  >
    The {route} screen. A screen reader starts reading here after every switch instead of staying on the
    button you pressed.
  </div>
</div>
