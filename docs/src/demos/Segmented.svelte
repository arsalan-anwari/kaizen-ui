<script lang="ts">
  import { Segmented } from "kaizen-ui";

  let mode = $state<"read" | "write">("read");
</script>

<Segmented
  items={[
    { value: "read", label: "Reading" },
    { value: "write", label: "Writing" }
  ]}
  value={mode}
  size="md"
  onpick={(v) => (mode = v)}
/>
<span class="text-sm text-foreground/75">picked: {mode}</span>
