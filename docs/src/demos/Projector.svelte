<script lang="ts">
  import { Projector } from "kaizen-ui";
</script>

<figure class="flex flex-col items-center gap-2">
  <Projector>
    <span class="text-board-foreground text-h1 font-bold">問</span>
  </Projector>
  <figcaption class="text-xs text-foreground/75">
    default, for a quiz projected to the group
  </figcaption>
</figure>

<figure class="flex flex-col items-center gap-2">
  <Projector size="lg" guide={false}>
    <span class="text-board-foreground text-h1 font-bold">答</span>
  </Projector>
  <figcaption class="text-xs text-foreground/75">size="lg", no guide</figcaption>
</figure>
