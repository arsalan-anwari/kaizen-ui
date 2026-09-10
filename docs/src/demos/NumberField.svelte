<script lang="ts">
  import { NumberField } from "kaizen-ui";

  let count = $state(12);
</script>

<NumberField
  value={count}
  min={1}
  max={99}
  label="Questions"
  unit="cards"
  oncommit={(v) => (count = v)}
/>
<span class="text-sm text-foreground/75">value: {count}</span>
