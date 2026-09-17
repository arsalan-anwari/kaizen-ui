<script lang="ts">
  import { Button, keynavShortcuts, ShortcutHelp } from "kaizen-ui";

  let open = $state(false);

  const groups = [
    {
      title: "Moving around",
      items: keynavShortcuts({
        start: "Start keyboard mode",
        stop: "Stop keyboard mode",
        section: "Previous or next section",
        next: "Next control",
        previous: "Previous control",
        edges: "First or last control",
        scroll: "Scroll the page",
        select: "Pick the focused control",
        confirm: "Confirm",
        page: "Previous or next group",
        close: "Close what is open"
      })
    },
    {
      title: "This page",
      items: [
        { keys: ["?"], label: "Open this list" },
        { keys: ["/"], label: "Jump to the search box of your browser" }
      ]
    }
  ];
</script>

<div class="flex flex-col gap-3">
  <Button size="sm" variant="outline" class="self-start" onclick={() => (open = true)}>
    Open the shortcut menu
  </Button>

  <p class="text-sm text-foreground/75">
    <code>keynavShortcuts</code> writes the first group, so the keys stay next to the code that
    handles them and you only pass translated labels. Add your own groups after it.
  </p>
</div>

{#if open}
  <ShortcutHelp
    title="Keyboard shortcuts"
    closeLabel="Close"
    {groups}
    onclose={() => (open = false)}
  />
{/if}
