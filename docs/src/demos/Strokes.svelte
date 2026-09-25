<script lang="ts">
  import { Strokes } from "kaizen-ui";

  const person = [
    "M35,16.5c0.25,1.75,0.25,4.25-0.88,6.8C28.91,35.01,22.37,46.02,10.5,60.29",
    "M26.28,42.5c0.72,1.25,1.26,3.48,1.26,4.75c0,12.75-0.07,29.88-0.26,42.25c-0.02,1.54-0.04,2.97-0.04,4.25"
  ];
</script>

<div class="flex items-end gap-4">
  <Strokes strokes={person} class="size-24" label="亻, person" />
  <Strokes strokes={person} viewBox="0 0 54.5 109" class="h-24" />
</div>
