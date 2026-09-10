<script lang="ts">
  import { Button, ConfirmDialog } from "kaizen-ui";

  let asking = $state(false);
  let answer = $state("");
</script>

<Button variant="danger" onclick={() => (asking = true)}>Delete deck</Button>
<span class="text-sm text-foreground/75">{answer}</span>
{#if asking}
  <ConfirmDialog
    title="Delete this deck?"
    confirmLabel="Delete"
    cancelLabel="Keep"
    closeLabel="Close"
    onconfirm={() => {
      answer = "deleted";
      asking = false;
    }}
    oncancel={() => {
      answer = "kept";
      asking = false;
    }}
  >
    Every card in it goes too. This cannot be undone.
  </ConfirmDialog>
{/if}
