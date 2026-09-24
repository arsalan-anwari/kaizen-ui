<script lang="ts">
  import { Badge, Button, ShelfCard, Switch } from "kaizen-ui";

  let on = $state(true);
</script>

<div class="grid w-full gap-4 sm:grid-cols-2">
  <ShelfCard
    title="JLPT N5"
    subtitle="The first level"
    meta={["184 words", "79 kanji", "9.3 MB"]}
    glyph="五"
  >
    {#snippet corner()}<Badge tone="brand">N5</Badge>{/snippet}
    {#snippet badge()}<Badge tone="success">Installed</Badge>{/snippet}
    {#snippet actions()}<Switch
        label="Use in practice"
        checked={on}
        onchange={(value) => (on = value)}
      />{/snippet}
  </ShelfCard>
  <ShelfCard
    title="Food and drink"
    subtitle="Menus and markets"
    meta={["60 words", "2.1 MB"]}
    glyph="食"
    tone="seal"
  >
    {#snippet corner()}<Badge tone="seal">N5</Badge>{/snippet}
    {#snippet actions()}<Button variant="brand">Download</Button>{/snippet}
  </ShelfCard>
</div>
