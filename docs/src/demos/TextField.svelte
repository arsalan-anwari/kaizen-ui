<script lang="ts">
  import { TextField } from "kaizen-ui";

  let text = $state("");
</script>

<div class="grid w-full gap-3 sm:grid-cols-3">
  <TextField bind:value={text} placeholder="Type an answer" />
  <TextField value="correct" tone="correct" />
  <TextField value="wrong" tone="wrong" />
</div>
<TextField value="" placeholder="big" big />
