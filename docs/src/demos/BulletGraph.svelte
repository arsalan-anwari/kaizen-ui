<script lang="ts">
  import { BulletGraph, masteryOf, strength, type MasteryLabels, type StatRow } from "kaizen-ui";

  const labels: MasteryLabels = {
    new: "New",
    shaky: "Shaky",
    learning: "Learning",
    steady: "Steady",
    mastered: "Mastered"
  };

  const seen: [string, string, number, number][] = [
    ["Hiragana", "hiragana", 12, 14],
    ["Katakana", "katakana", 7, 12],
    ["Kanji", "kanji", 3, 11]
  ];

  const rows: StatRow[] = seen.map(([label, key, correct, total]) => ({
    key,
    label,
    sub: key,
    total,
    correct,
    accuracy: correct / total,
    strength: strength(correct, total),
    mastery: masteryOf(correct, total)
  }));
</script>

<div class="w-full">
  <BulletGraph
    {rows}
    {labels}
    empty="Finish a run to see mastery per set."
    describe={(row) => `${row.label}: ${row.correct} of ${row.total} right, ${labels[row.mastery]}`}
  />
</div>
