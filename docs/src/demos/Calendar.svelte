<script lang="ts">
  import { Calendar } from "kaizen-ui";

  let day = $state("");
</script>

<div class="w-full max-w-xs">
  <Calendar bind:value={day} />
</div>
<span class="text-sm text-foreground/75">picked: {day === "" ? "—" : day}</span>
