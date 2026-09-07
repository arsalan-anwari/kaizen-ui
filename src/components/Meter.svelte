<script lang="ts">
  import { heatColor } from "../heat";
  import Progress from "./Progress.svelte";

  let {
    value,
    label = "",
    caption = "",
    tone = "heat",
    size = "md",
    showValue = true,
    class: className = ""
  }: {
    value: number;
    label?: string;
    caption?: string;
    tone?: "heat" | "brand" | "success";
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    class?: string;
  } = $props();

  const share = $derived(Math.max(0, Math.min(1, value)));
  const percent = $derived(Math.round(share * 100));
</script>

<div class="flex w-full flex-col gap-1 {className}">
  {#if label !== "" || showValue}
    <div class="flex items-baseline justify-between gap-2">
      <span class="truncate text-xs font-bold">{label}</span>
      {#if showValue}
        <span
          class="shrink-0 text-xs font-bold tabular-nums"
          style={tone === "heat" ? `color: ${heatColor(share)}` : ""}
        >
          {percent}%
        </span>
      {/if}
    </div>
  {/if}

  {#if tone === "heat"}
    <div
      class="w-full overflow-hidden rounded-full bg-secondary {size === 'sm'
        ? 'h-1.5'
        : size === 'lg'
          ? 'h-4'
          : 'h-3'}"
      role="progressbar"
      aria-label={label === "" ? undefined : label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        class="h-full rounded-full transition-[width] duration-500 ease-out"
        style="width: {share * 100}%; background: {heatColor(share)}"
      ></div>
    </div>
  {:else}
    <Progress value={share} tone={tone === "brand" ? "brand" : "success"} {size} {label} />
  {/if}

  {#if caption !== ""}
    <span class="text-[0.6875rem] leading-tight text-muted-foreground">{caption}</span>
  {/if}
</div>
