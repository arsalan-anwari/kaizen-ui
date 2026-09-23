<script lang="ts">
  import { TreeTable, type TreeTableGroup } from "kaizen-ui";

  const groups: TreeTableGroup[] = [
    {
      key: "hiragana",
      label: "Hiragana",
      total: 46,
      correct: 39,
      children: [
        { key: "a-row", label: "A-row", total: 5, correct: 5 },
        { key: "ka-row", label: "KA-row", total: 5, correct: 4 },
        { key: "na-row", label: "NA-row", total: 5, correct: 3 }
      ]
    },
    {
      key: "katakana",
      label: "Katakana",
      total: 46,
      correct: 28,
      children: [
        { key: "a-row", label: "A-row", total: 5, correct: 4 },
        { key: "ka-row", label: "KA-row", total: 5, correct: 2 }
      ]
    }
  ];
</script>

<div class="w-full">
  <TreeTable
    {groups}
    columns={{ group: "Set", accuracy: "Accuracy", bar: "", score: "Score" }}
    empty="Finish a run to see set breakdowns."
  />
</div>
