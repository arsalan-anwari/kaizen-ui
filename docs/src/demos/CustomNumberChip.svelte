<script lang="ts">
  import { CustomNumberChip } from "kaizen-ui";

  let minutes = $state(15);
</script>

<CustomNumberChip
  value={minutes}
  min={5}
  max={60}
  unit="min"
  title="Session length"
  doneLabel="Done"
  cancelLabel="Cancel"
  active
  onpick={(v) => (minutes = v)}
/>
