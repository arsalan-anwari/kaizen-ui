<script lang="ts">
  import { Board } from "kaizen-ui";
</script>

<figure class="flex flex-col items-center gap-2">
  <Board>
    <span class="text-board-foreground text-h1 font-bold">日</span>
  </Board>
  <figcaption class="text-xs text-foreground/75">default</figcaption>
</figure>

<figure class="flex flex-col items-center gap-2">
  <Board size="lg" guide={false}>
    <span class="text-board-foreground text-h1 font-bold">本</span>
  </Board>
  <figcaption class="text-xs text-foreground/75">size="lg", no guide</figcaption>
</figure>

<figure class="flex flex-col items-center gap-2">
  <Board compact>
    <span class="text-board-foreground text-h3 font-bold">語</span>
  </Board>
  <figcaption class="text-xs text-foreground/75">compact</figcaption>
</figure>

<!-- `compact` is the half-height shape a phone in landscape gets; above the
     `sm` breakpoint it goes back to a square, so force the size to show it. -->
<figure class="flex flex-col items-center gap-2">
  <Board compact class="h-24! w-72!">
    <span class="text-board-foreground text-h3 font-bold">学</span>
  </Board>
  <figcaption class="text-xs text-foreground/75">compact, forced half height</figcaption>
</figure>
