<script lang="ts">
  import { Segmented } from "kaizen-ui";

  let mode = $state<"read" | "write">("read");
  let long = $state<"one" | "two">("one");
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

<!-- Constrained and given long labels, the tabs wrap onto a second row instead
     of scrolling sideways. -->
<div class="w-56">
  <Segmented
    items={[
      { value: "one", label: "First longer tab" },
      { value: "two", label: "Second longer tab" }
    ]}
    value={long}
    size="md"
    onpick={(v) => (long = v)}
  />
</div>
