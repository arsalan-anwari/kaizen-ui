<script lang="ts">
  import { Badge, Card, Icon } from "kaizen-ui";
</script>

<div class="grid w-full gap-4 sm:grid-cols-2">
  <Card title="Today" description="Cards due before midnight">
    {#snippet icon()}<Icon name="target" class="size-5" />{/snippet}
    {#snippet action()}<Badge tone="brand">12</Badge>{/snippet}
    <p class="text-sm text-foreground/75">
      Ruled paper sheet with an optional icon and action.
    </p>
  </Card>
  <Card>
    <p class="text-sm text-foreground/75">Headerless card: children only.</p>
  </Card>
</div>
