<script lang="ts">
  import { Button, dismissSplash } from "kaizen-ui";

  const markup = `<div id="splash" role="status" aria-live="polite">
  <div class="mark" aria-hidden="true">改</div>
  <div class="name">kaizen-ui</div>
  <div class="hint">Loading…</div>
  <div class="bar" aria-hidden="true"><span></span></div>
</div>`;

  function replay(): void {
    if (document.getElementById("splash") !== null) return;
    document.body.insertAdjacentHTML("beforeend", markup);
    setTimeout(() => dismissSplash(), 1400);
  }
</script>

<Button onclick={replay}>Replay the splash</Button>
<span class="text-sm text-foreground/75">Fades out after 1.4s.</span>
