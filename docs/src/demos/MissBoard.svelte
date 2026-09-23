<script lang="ts">
  import { MissBoard, type MissSection } from "kaizen-ui";

  const sections: MissSection[] = [
    {
      key: "ka-row",
      label: "KA-row",
      total: 7,
      tiles: [
        { key: "ki", label: "き", count: 4 },
        { key: "ku", label: "く", count: 3 }
      ]
    },
    {
      key: "na-row",
      label: "NA-row",
      total: 5,
      tiles: [
        { key: "nu", label: "ぬ", count: 3 },
        { key: "ne", label: "ね", count: 2 }
      ]
    }
  ];
</script>

<div class="w-full">
  <MissBoard
    {sections}
    empty="No misses yet."
    describeTile={(tile) => `${tile.label}, missed ${tile.count} times`}
  />
</div>
