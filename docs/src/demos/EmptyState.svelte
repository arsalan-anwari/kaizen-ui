<script lang="ts">
  import { Button, EmptyState } from "kaizen-ui";
</script>

<div class="w-full">
  <EmptyState icon="sprout" title="No decks yet" hint="Make one to start drilling.">
    {#snippet action()}<Button size="sm">New deck</Button>{/snippet}
  </EmptyState>
</div>
