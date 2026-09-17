<script lang="ts">
  import { TextField } from "kaizen-ui";

  let text = $state("");
</script>

<div class="grid w-full gap-3 sm:grid-cols-3">
  <TextField bind:value={text} label="Answer" placeholder="Type an answer" />
  <TextField value="correct" label="A right answer" tone="correct" />
  <TextField value="wrong" label="A wrong answer" tone="wrong" />
</div>
<TextField value="" label="The big shape" placeholder="big" big />
