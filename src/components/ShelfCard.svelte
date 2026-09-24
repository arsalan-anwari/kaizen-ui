<script lang="ts">
  import type { Snippet } from "svelte";

  type Tone = "brand" | "seal" | "gold" | "success";

  let {
    title,
    subtitle = "",
    meta = [],
    glyph = "",
    tone = "brand",
    muted = false,
    art,
    corner,
    badge,
    children,
    actions
  }: {
    title: string;
    subtitle?: string;
    meta?: string[];
    glyph?: string;
    tone?: Tone;
    muted?: boolean;
    art?: Snippet;
    corner?: Snippet;
    badge?: Snippet;
    children?: Snippet;
    actions?: Snippet;
  } = $props();

  const uid = $props.id();

  const tones: Record<Tone, string> = {
    brand: "bg-brand-soft text-brand",
    seal: "bg-seal-soft text-seal",
    gold: "bg-gold-soft text-gold",
    success: "bg-success-soft text-success"
  };
</script>

<article
  aria-labelledby="{uid}-title"
  class="sheet flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-surface transition-[transform,opacity] duration-150 motion-safe:hover:-translate-y-0.5 {muted
    ? 'opacity-70'
    : ''}"
>
  <div class="ruled relative aspect-[16/7] overflow-hidden {tones[tone]}">
    {#if art}
      {@render art()}
    {:else if glyph !== ""}
      <span
        aria-hidden="true"
        class="jp absolute -end-2 -bottom-6 text-[7.5rem] leading-none font-bold opacity-25 select-none"
      >
        {glyph}
      </span>
      <span
        aria-hidden="true"
        class="jp absolute top-1/2 start-5 -translate-y-1/2 text-[3.5rem] leading-none font-bold select-none"
      >
        {glyph}
      </span>
    {/if}
    {#if corner}
      <div class="absolute top-3 start-3 flex flex-wrap gap-1.5">{@render corner()}</div>
    {/if}
    {#if badge}
      <div class="absolute top-3 end-3 flex flex-wrap justify-end gap-1.5">{@render badge()}</div>
    {/if}
  </div>

  <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
    <div class="flex flex-col gap-1">
      <h3 id="{uid}-title" class="text-h4 leading-tight font-bold tracking-tight">{title}</h3>
      {#if subtitle !== ""}
        <p class="text-sm leading-snug text-muted-foreground">{subtitle}</p>
      {/if}
    </div>
    {#if meta.length > 0}
      <ul class="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {#each meta as item, index (index)}
          <li class="flex items-center gap-3">
            {#if index > 0}<span aria-hidden="true">·</span>{/if}
            {item}
          </li>
        {/each}
      </ul>
    {/if}
    {#if children}
      {@render children()}
    {/if}
    {#if actions}
      <div class="mt-auto flex flex-wrap items-center gap-2 pt-1">{@render actions()}</div>
    {/if}
  </div>
</article>
