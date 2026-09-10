<script lang="ts">
  import { PlayIcon } from "kaizen-ui";

  let playing = $state(false);
</script>

<PlayIcon class="size-8" />
<PlayIcon playing class="size-8" />
<button type="button" class="cursor-pointer" onclick={() => (playing = !playing)}>
  <PlayIcon {playing} class="size-8" />
</button>
