<script lang="ts">
  import {
    RowHeatmap,
    masteryOf,
    strength,
    type HeatCell,
    type HeatRow,
    type MasteryLabels
  } from "kaizen-ui";

  const labels: MasteryLabels = {
    new: "New",
    shaky: "Shaky",
    learning: "Learning",
    steady: "Steady",
    mastered: "Mastered"
  };

  const table: [string, [string, string, number, number][]][] = [
    [
      "A-row",
      [
        ["あ", "a", 14, 14],
        ["い", "i", 12, 13],
        ["う", "u", 9, 12],
        ["え", "e", 5, 11],
        ["お", "o", 0, 0]
      ]
    ],
    [
      "KA-row",
      [
        ["か", "ka", 11, 12],
        ["き", "ki", 8, 12],
        ["く", "ku", 6, 12],
        ["け", "ke", 3, 10],
        ["こ", "ko", 10, 11]
      ]
    ],
    [
      "NA-row",
      [
        ["な", "na", 7, 11],
        ["に", "ni", 9, 11],
        ["ぬ", "nu", 2, 9],
        ["ね", "ne", 4, 10],
        ["の", "no", 12, 12]
      ]
    ]
  ];

  function cell([glyph, romaji, correct, total]: [string, string, number, number]): HeatCell {
    return {
      key: romaji,
      glyph,
      romaji,
      total,
      correct,
      accuracy: total === 0 ? 0 : correct / total,
      strength: strength(correct, total),
      mastery: masteryOf(correct, total)
    };
  }

  const rows: HeatRow[] = table.map(([label, entries]) => {
    const cells = entries.map(cell);
    const total = cells.reduce((sum, item) => sum + item.total, 0);
    const correct = cells.reduce((sum, item) => sum + item.correct, 0);
    return {
      id: label,
      label,
      total,
      correct,
      accuracy: total === 0 ? 0 : correct / total,
      strength: strength(correct, total),
      mastery: masteryOf(correct, total),
      cells
    };
  });
</script>

<div class="w-full">
  <RowHeatmap
    {rows}
    {labels}
    empty="No rows yet."
    describeCell={(item) =>
      item.total === 0
        ? `${item.romaji}, never came up`
        : `${item.romaji}: ${item.correct} of ${item.total} right, ${labels[item.mastery]}`}
    describeRow={(row) =>
      `${row.label}, ${row.correct} of ${row.total} right, ${labels[row.mastery]}`}
  />
</div>
