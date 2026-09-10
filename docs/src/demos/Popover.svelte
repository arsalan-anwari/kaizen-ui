<script lang="ts">
  import { Button, Popover } from "kaizen-ui";

  let anchor = $state<HTMLElement | null>(null);
  let open = $state(false);
</script>

<div bind:this={anchor} class="inline-block">
  <Button variant="outline" onclick={() => (open = !open)}>Open popover</Button>
</div>
{#if open}
  <Popover {anchor} label="Details" closeLabel="Close" onclose={() => (open = false)}>
    {#snippet children(close)}
      <div class="flex flex-col gap-3 p-4">
        <p class="text-sm">Anchored beside the trigger on a wide screen, fullscreen on a phone.</p>
        <Button size="sm" onclick={close}>Got it</Button>
      </div>
    {/snippet}
  </Popover>
{/if}
