<script lang="ts">
  import { Button, Chip, PlayIcon, Waveform } from "kaizen-ui";
  import { clips, kana, pick, play, player, start } from "../audio.svelte";

  $effect(start);
</script>

<div class="flex w-full flex-wrap items-center gap-2">
  {#each clips as name (name)}
    <Chip size="sm" active={player.clip === name} onclick={() => pick(name)}>
      {kana[name]} {name}
    </Chip>
  {/each}
  <Button size="sm" variant="outline" onclick={play}>
    <PlayIcon playing={player.playing} class="size-4" /> Play
  </Button>
</div>

<!-- Waveform fills its parent, so the height goes on the box around it. -->
<div class="h-14 w-full">
  <Waveform peaks={player.peaks} progress={player.progress} />
</div>
<div class="h-10 w-full">
  <Waveform peaks={player.peaks} progress={0.7} tone="success" />
</div>
