<script lang="ts">
  import { Glyph, sfx, WoodBlock } from "kaizen-ui";
</script>

<div class="flex flex-wrap items-end gap-3">
  {#each ["木", "る", "日"] as face (face)}
    <WoodBlock label={face} onclick={() => sfx.wood.pick()}>
      <Glyph text={face} class="text-h2" />
    </WoodBlock>
  {/each}
  <WoodBlock label="亻" cols={2} onclick={() => sfx.wood.pick()}>
    <Glyph text="亻" class="text-h2" />
  </WoodBlock>
</div>
