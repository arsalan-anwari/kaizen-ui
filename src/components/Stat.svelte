<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconName } from "./icons";

  let {
    value,
    label,
    icon,
    tone = "plain",
    class: className = ""
  }: {
    value: string | number;
    label: string;
    icon?: IconName;
    tone?: "plain" | "brand" | "seal" | "success" | "gold";
    class?: string;
  } = $props();

  const tones = {
    plain: "border-wire bg-surface text-foreground",
    brand: "border-brand/30 bg-brand-soft text-brand",
    seal: "border-seal/30 bg-seal-soft text-seal",
    success: "border-success/30 bg-success-soft text-success",
    gold: "border-gold/30 bg-gold-soft text-gold"
  };
</script>

<div
  class="flex min-w-0 flex-col items-center gap-1 rounded-xl border-2 px-3.5 py-3.5 text-center {tones[
    tone
  ]} {className}"
>
  <span class="flex items-center gap-1.5 text-h3 font-bold leading-none tabular-nums">
    {#if icon}
      <Icon name={icon} class="size-5" />
    {/if}
    {value}
  </span>
  <span class="truncate text-xs font-semibold uppercase tracking-wide opacity-70">
    {label}
  </span>
</div>
