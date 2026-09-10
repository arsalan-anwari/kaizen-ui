<script lang="ts">
  import { Progress } from "kaizen-ui";
</script>

<div class="flex w-full flex-col gap-3">
  <Progress value={0.25} label="Session" />
  <Progress value={0.5} tone="primary" size="sm" />
  <Progress value={0.75} tone="success" size="lg" />
  <Progress value={0.4} tone="seal" />
</div>
