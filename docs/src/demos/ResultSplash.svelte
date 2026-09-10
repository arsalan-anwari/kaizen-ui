<script lang="ts">
  import { Button, fanfareGrades, ResultSplash, sfx, type FanfareGrade } from "kaizen-ui";

  const copy: Record<FanfareGrade, [string, string]> = {
    perfect: ["Perfect run", "Every single one. Nothing left to fix."],
    great: ["Great run", "Almost clean. A couple slipped past."],
    good: ["Good run", "Solid. The shaky ones are worth another pass."],
    fair: ["Getting there", "Half of them stuck. Run it again."],
    poor: ["Rough run", "Shorten the deck and go slower."]
  };

  const scores: Record<FanfareGrade, [number, number]> = {
    perfect: [20, 20],
    great: [19, 20],
    good: [16, 20],
    fair: [12, 20],
    poor: [7, 20]
  };

  let showing = $state<FanfareGrade | null>(null);

  function run(grade: FanfareGrade): void {
    showing = grade;
    sfx.score(grade);
  }
</script>

{#each fanfareGrades as grade (grade)}
  <Button size="sm" variant="ghost" silent onclick={() => run(grade)}>{grade}</Button>
{/each}

{#if showing}
  {@const [correct, total] = scores[showing]}
  <ResultSplash
    grade={showing}
    headline={copy[showing][0]}
    blurb={copy[showing][1]}
    hint="tap anywhere to skip"
    ondismiss={() => (showing = null)}
  >
    {correct} / {total}
    <span class="text-muted-foreground">· {Math.round((correct / total) * 100)}%</span>
  </ResultSplash>
{/if}
