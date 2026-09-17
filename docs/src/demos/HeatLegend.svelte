<script lang="ts">
  import { HeatLegend, type MasteryLabels } from "kaizen-ui";

  const labels: MasteryLabels = {
    new: "New",
    shaky: "Shaky",
    learning: "Learning",
    steady: "Steady",
    mastered: "Mastered"
  };
</script>

<HeatLegend {labels} />
