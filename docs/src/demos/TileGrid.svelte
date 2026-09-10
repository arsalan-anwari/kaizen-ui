<script lang="ts">
  import { Chip, TileGrid } from "kaizen-ui";
</script>

<div class="w-full">
  <TileGrid>
    {#each ["あ", "い", "う", "え", "お", "か", "き", "く"] as glyph (glyph)}
      <Chip>{glyph}</Chip>
    {/each}
  </TileGrid>
</div>
