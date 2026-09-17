<script lang="ts">
  import { AccuracyGrid, masteryOf, strength, type MasteryLabels, type StatRow } from "kaizen-ui";

  const labels: MasteryLabels = {
    new: "New",
    shaky: "Shaky",
    learning: "Learning",
    steady: "Steady",
    mastered: "Mastered"
  };

  const seen: [string, string, number, number][] = [
    ["ぬ", "nu", 2, 9],
    ["ね", "ne", 4, 10],
    ["れ", "re", 6, 11],
    ["わ", "wa", 8, 11],
    ["さ", "sa", 9, 11],
    ["き", "ki", 11, 12],
    ["し", "shi", 12, 12],
    ["あ", "a", 14, 14]
  ];

  const rows: StatRow[] = seen.map(([glyph, romaji, correct, total]) => ({
    key: romaji,
    label: glyph,
    sub: romaji,
    total,
    correct,
    accuracy: correct / total,
    strength: strength(correct, total),
    mastery: masteryOf(correct, total)
  }));
</script>

<div class="w-full">
  <AccuracyGrid
    {rows}
    {labels}
    empty="Finish a run to see character stats."
    describe={(row) =>
      `${row.sub}: ${row.correct} of ${row.total} right, ${labels[row.mastery]}`}
  />
</div>
