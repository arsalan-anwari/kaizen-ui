<script lang="ts">
  import { FitText, TextField } from "kaizen-ui";

  let text = $state("counterintuitive");
</script>

<div class="flex w-full flex-col gap-3">
  <div class="flex flex-wrap gap-3">
    <div
      class="@container flex aspect-[3/2] w-44 items-center justify-center rounded-2xl border-2 border-border bg-surface"
    >
      <FitText {text} cap={30} em={0.55} class="font-bold" />
    </div>
    <div
      class="@container flex aspect-square w-44 items-center justify-center rounded-2xl border-2 border-border bg-surface"
    >
      <FitText text="日本語" cap={34} em={1} unit="cqmin" lang="ja" class="jp font-bold" />
    </div>
  </div>

  <TextField bind:value={text} label="Type something long" />

  <p class="text-sm text-foreground/75">
    The text is measured once in its own face and sized in container units, so it never wraps and
    keeps fitting as the box resizes without measuring again.
  </p>
</div>
