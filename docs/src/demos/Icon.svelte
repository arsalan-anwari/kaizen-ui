<script lang="ts">
  import { Icon, type IconName } from "kaizen-ui";

  const names: IconName[] = [
    "sun", "moon", "monitor", "select-all", "select-none", "folder-open", "download",
    "trash", "plus", "save", "restore", "filter", "calendar", "chevron-down",
    "chevron-right", "chevron-left", "sliders", "contrast", "volume-on", "volume-off",
    "zoom-in", "zoom-out", "close", "check", "flame", "sprout", "target", "trophy", "info"
  ];
</script>

<div class="grid w-full grid-cols-4 gap-3 sm:grid-cols-8">
  {#each names as name (name)}
    <div class="flex flex-col items-center gap-1 text-[0.65rem] text-foreground/75">
      <Icon {name} class="size-6" />
      {name}
    </div>
  {/each}
</div>
