<script lang="ts">
  import { Meter } from "kaizen-ui";
</script>

<div class="grid w-full gap-4 sm:grid-cols-3">
  <Meter value={0.3} label="Recall" caption="last 7 days" />
  <Meter value={0.65} label="Speed" tone="brand" />
  <Meter value={0.92} label="Accuracy" tone="success" size="lg" />
</div>
