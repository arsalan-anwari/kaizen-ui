<script lang="ts">
  import { heatColor } from "../heat";
  import { masteryLevels, type MasteryLabels } from "../mastery";

  let { labels, class: className = "" }: { labels: MasteryLabels; class?: string } = $props();

  const marks: Record<string, number> = {
    new: 0,
    shaky: 0.2,
    learning: 0.48,
    steady: 0.7,
    mastered: 0.95
  };
</script>

<div class="flex flex-wrap items-center gap-x-3 gap-y-1 {className}">
  {#each masteryLevels as level (level)}
    <span class="flex items-center gap-1 text-[0.625rem] text-muted-foreground">
      <span
        class="size-2 rounded-full border border-border"
        style="background: {level === 'new' ? 'var(--color-secondary)' : heatColor(marks[level])}"
        aria-hidden="true"
      ></span>
      {labels[level]}
    </span>
  {/each}
</div>
