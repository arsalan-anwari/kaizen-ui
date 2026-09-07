<script lang="ts">
  import type { Snippet } from "svelte";

  type Tone = "default" | "outline" | "success" | "danger" | "brand" | "seal" | "gold";

  let {
    tone = "outline",
    class: className = "",
    children
  }: { tone?: Tone; class?: string; children: Snippet } = $props();

  const tones: Record<Tone, string> = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-muted-foreground",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
    brand: "bg-brand text-brand-foreground",
    seal: "bg-seal-soft text-seal",
    gold: "bg-gold-soft text-gold"
  };
</script>

<span
  class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold {tones[tone]} {className}"
>
  {@render children()}
</span>
