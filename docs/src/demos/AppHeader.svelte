<script lang="ts">
  import { AppHeader } from "kaizen-ui";

  let tab = $state("components");
</script>

<div class="w-full rounded-xl border-2 border-border bg-background p-4">
  <AppHeader
    glyph="改"
    title="Kaizen UI"
    subtitle="Paper and ink components for Svelte 5"
    sticky={false}
    items={[
      { value: "components", label: "Components" },
      { value: "theme", label: "Theme" },
      { value: "runtime", label: "Runtime" }
    ]}
    value={tab}
    onpick={(v) => (tab = v)}
    settingsLabel="Settings"
    onsettings={() => {}}
  />
</div>
