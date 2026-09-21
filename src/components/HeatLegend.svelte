<script lang="ts">
  import { masteryColor } from "../heat";
  import { masteryLevels, type MasteryLabels } from "../mastery";

  let { labels, class: className = "" }: { labels: MasteryLabels; class?: string } = $props();
</script>

<div class="flex flex-wrap items-center gap-x-3 gap-y-1 {className}">
  {#each masteryLevels as level (level)}
    <span class="flex items-center gap-1 text-[0.625rem] text-muted-foreground">
      <span
        class="size-2 rounded-full border border-border"
        style="background: {masteryColor(level)}"
        aria-hidden="true"
      ></span>
      {labels[level]}
    </span>
  {/each}
</div>
