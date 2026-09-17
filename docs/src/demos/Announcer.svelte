<script lang="ts">
  import { Announcer, Button } from "kaizen-ui";

  let polite = $state("");
  let urgent = $state("");
  let count = $state(0);
</script>

<div class="flex flex-col gap-3">
  <div class="flex flex-wrap gap-2">
    <Button
      size="sm"
      variant="outline"
      onclick={() => {
        count += 1;
        polite = `Exported ${count} runs`;
      }}
    >
      Say it politely
    </Button>
    <Button size="sm" variant="danger" onclick={() => (urgent = "Not quite. あ = a")}>
      Interrupt
    </Button>
  </div>

  <p class="text-sm text-foreground/75">
    Nothing is drawn. Turn a screen reader on: polite waits its turn, assertive cuts in, and the
    same text twice is announced twice.
  </p>

  <Announcer message={polite} />
  <Announcer assertive message={urgent} />
</div>
