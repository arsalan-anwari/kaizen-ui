<script lang="ts">
  import { Select } from "kaizen-ui";

  let level = $state("n5");
</script>

<Select
  bind:value={level}
  options={[
    { value: "n5", label: "N5 — beginner" },
    { value: "n4", label: "N4" },
    { value: "n3", label: "N3" }
  ]}
  label="Level"
  closeLabel="Close"
/>
<Select
  value=""
  options={[{ value: "a", label: "Option A" }]}
  label="Small"
  placeholder="Pick one"
  size="sm"
  closeLabel="Close"
/>
<Select value="" options={[]} label="Disabled" placeholder="None" disabled closeLabel="Close" />
