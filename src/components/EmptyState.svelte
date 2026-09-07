<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";
  import type { IconName } from "./icons";

  let {
    icon = "sprout",
    title,
    hint = "",
    action
  }: { icon?: IconName; title: string; hint?: string; action?: Snippet } = $props();
</script>

<div class="flex flex-col items-center gap-2.5 px-4 py-10 text-center">
  <span class="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
    <Icon name={icon} class="size-7" />
  </span>
  <p class="text-base font-bold">{title}</p>
  {#if hint !== ""}
    <p class="max-w-xs text-sm leading-snug text-muted-foreground">{hint}</p>
  {/if}
  {#if action}
    <div class="mt-1">{@render action()}</div>
  {/if}
</div>
