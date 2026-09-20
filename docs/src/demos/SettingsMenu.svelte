<script lang="ts">
  import { Button, SettingsMenu } from "kaizen-ui";

  let open = $state(false);
</script>

<div class="flex flex-col gap-3">
  <Button variant="outline" size="sm" onclick={() => (open = true)}>Open settings</Button>

  <p class="text-sm text-foreground/75">
    Everything <code>AppControls</code> holds, laid out as a full-screen sheet for a phone. It owns the
    prefs too, so it writes the theme, contrast, zoom, sound and locale back on its own.
  </p>
</div>

{#if open}
  <SettingsMenu onclose={() => (open = false)} />
{/if}
