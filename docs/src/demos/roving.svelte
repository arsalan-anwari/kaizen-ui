<script lang="ts">
  import { Chip, roving } from "kaizen-ui";

  let picked = $state("あ");
</script>

<div class="flex flex-col gap-3">
  <div use:roving class="flex max-w-md flex-wrap gap-2">
    {#each ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"] as kana (kana)}
      <Chip size="sm" active={picked === kana} onclick={() => (picked = kana)}>{kana}</Chip>
    {/each}
  </div>

  <p class="text-sm text-foreground/75">
    Ten chips, one tab stop. Arrow keys move inside, up and down cross a whole row, Home and End
    hit the edges. In keyboard mode every chip becomes a tab stop instead, so Tab alone walks them.
  </p>
</div>
