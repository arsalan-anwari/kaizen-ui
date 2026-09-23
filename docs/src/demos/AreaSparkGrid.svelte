<script lang="ts">
  import { AreaSparkGrid, type AreaSparkGroup } from "kaizen-ui";

  const groups: AreaSparkGroup[] = [
    {
      key: "hiragana",
      label: "Hiragana",
      series: [
        { key: "a-row", label: "A-row", average: 88, points: [60, 65, 70, 75, 80, 88] },
        { key: "ka-row", label: "KA-row", average: 74, points: [50, 55, 58, 62, 68, 74] }
      ]
    },
    {
      key: "katakana",
      label: "Katakana",
      series: [{ key: "a-row", label: "A-row", average: 61, points: [40, 42, 48, 52, 57, 61] }]
    }
  ];
</script>

<div class="w-full">
  <AreaSparkGrid
    {groups}
    unit="%"
    empty="Finish a run to see trends."
    describeSeries={(series) => `${series.label}: averaging ${series.average}%`}
  />
</div>
