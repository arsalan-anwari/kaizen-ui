<script lang="ts">
  import { Button, NumberRoller } from "kaizen-ui";

  let open = $state(false);
  let cards = $state(20);
</script>

<Button variant="outline" onclick={() => (open = true)}>Pick a number ({cards})</Button>
{#if open}
  <NumberRoller
    values={[10, 20, 30, 40, 50]}
    value={cards}
    title="Cards per session"
    doneLabel="Done"
    cancelLabel="Cancel"
    onpick={(v) => {
      cards = v;
      open = false;
    }}
    onclose={() => (open = false)}
  />
{/if}
