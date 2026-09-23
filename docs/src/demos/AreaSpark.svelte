<script lang="ts">
  import { AreaSpark } from "kaizen-ui";

  const values = [4, 6, 5, 8, 9, 7, 11, 10, 13, 15, 14, 17];
</script>

<div class="flex flex-col gap-2">
  <AreaSpark {values} width={160} height={44} label="Accuracy trend, last 12 runs" />
  <span class="text-xs text-foreground/75">last 12 runs</span>
</div>
