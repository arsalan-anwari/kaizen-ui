<script lang="ts">
  import { Chip, RecordPlayer } from "kaizen-ui";
  import { clips, kana, pick, play, player, start } from "../audio.svelte";

  $effect(start);
</script>

<div class="flex w-full flex-wrap items-center gap-2">
  {#each clips as name (name)}
    <Chip size="sm" active={player.clip === name} onclick={() => pick(name)}>
      {kana[name]} {name}
    </Chip>
  {/each}
</div>

<!-- RecordPlayer fills its parent, so the box around it sets the size. The
     wide face is square, the compact one is roughly 2.6:1. -->
<div class="size-48">
  <RecordPlayer
    peaks={player.peaks}
    progress={player.progress}
    playing={player.playing}
    label="Play {player.clip}"
    onplay={play}
  />
</div>
<div class="h-24 w-64">
  <RecordPlayer
    peaks={player.peaks}
    progress={player.progress}
    playing={player.playing}
    compact
    label="Play {player.clip}"
    onplay={play}
  />
</div>
