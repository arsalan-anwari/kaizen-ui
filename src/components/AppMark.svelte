<script lang="ts">

  let {
    glyph,
    tone = "ink",
    class: className = "size-10"
  }: { glyph: string; tone?: "ink" | "seal"; class?: string } = $props();
</script>

<span
  class="kana inline-flex items-center justify-center rounded-xl font-medium {tone === 'seal'
    ? 'seal'
    : 'bg-foreground text-background'} {className}"
>
  {glyph}
</span>
