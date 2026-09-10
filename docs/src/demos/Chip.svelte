<script lang="ts">
  import { Chip } from "kaizen-ui";

  let picked = $state("hiragana");
</script>

{#each ["hiragana", "katakana", "kanji"] as name (name)}
  <Chip active={picked === name} onclick={() => (picked = name)}>{name}</Chip>
{/each}
<Chip size="sm">small</Chip>
<Chip disabled>disabled</Chip>
