<script lang="ts">
  import { Button, Dialog, Progress } from "kaizen-ui";

  let open = $state<"details" | "blocking" | null>(null);
  let done = $state(0);

  function start(): void {
    open = "blocking";
    done = 0;
    const tick = setInterval(() => {
      done += 0.1;
      if (done >= 1) {
        clearInterval(tick);
        open = null;
      }
    }, 200);
  }
</script>

<Button variant="outline" onclick={() => (open = "details")}>About this deck</Button>
<Button variant="brand" onclick={start}>First-start download</Button>

{#if open === "details"}
  <Dialog
    title="Travel phrases"
    description="42 words for stations and hotels."
    closeLabel="Close"
    onclose={() => (open = null)}
  >
    <p class="text-sm">Signs, tickets and platforms. Every word has a picture and a clip.</p>
  </Dialog>
{:else if open === "blocking"}
  <Dialog title="Getting the basics" description="Needed once, before anything else works.">
    <Progress value={done} label="Downloaded" />
  </Dialog>
{/if}
