<script lang="ts">
  import { Switch } from "kaizen-ui";

  let checked = $state(true);
</script>

<div class="w-full max-w-sm">
  <Switch
    {checked}
    label="Sound effects"
    hint="Plays a click on every answer"
    onchange={(v) => (checked = v)}
  />
</div>
