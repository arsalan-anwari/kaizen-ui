<script lang="ts">
  import { Button, fanfareGrades, sfx } from "kaizen-ui";

  const sounds = ["click", "select", "correct", "wrong", "tick", "start"] as const;
</script>

{#each sounds as name (name)}
  <Button size="sm" variant="outline" silent onclick={() => sfx[name]()}>{name}</Button>
{/each}
{#each fanfareGrades as grade (grade)}
  <Button size="sm" variant="ghost" silent onclick={() => sfx.score(grade)}>{grade}</Button>
{/each}
