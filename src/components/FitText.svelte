<script lang="ts">
  let {
    text,
    cap,
    unit = "cqi",
    em = 1,
    pad = 5,
    perLine = 0,
    lang = undefined,
    class: className = ""
  }: {
    text: string;
    /** Largest size the text may take, in `unit`. */
    cap: number;
    /**
     * Container unit the cap is measured against. `cqmin` pins it to the short
     * side, which is what a square wants; `cqi` needs a container that only
     * queries its inline size.
     */
    unit?: "cqi" | "cqb" | "cqmin";
    /** How wide one glyph runs, in em. Full-width Japanese is 1, latin ~0.55. */
    em?: number;
    /** Share of the container width kept clear down each side. */
    pad?: number;
    /** Most glyphs on one line before the text wraps. 0 keeps it on one line. */
    perLine?: number;
    lang?: string;
    class?: string;
  } = $props();

  // Code points, so a surrogate pair counts as the one glyph it draws as.
  const glyphs = $derived(Math.max(1, [...text].length));
  const lines = $derived(perLine > 0 ? Math.ceil(glyphs / perLine) : 1);
  const across = $derived(Math.ceil(glyphs / lines));

  const room = $derived(100 - 2 * pad);

  // The glyphs on the longest line need that many times the font size across
  // the container, so the size that just fits is the room divided by them. The
  // cap is what stops a short text from filling the whole box.
  // ponytail: width only. Past three lines the text can outgrow a short
  // container; give this a block budget if a caller ever needs that many.
  const fontSize = $derived(`min(${cap}${unit}, ${room / em / across}cqi)`);
</script>

<span
  {lang}
  class="text-center [line-break:strict] {lines > 1
    ? 'leading-[1.15]'
    : 'leading-none whitespace-nowrap'} {className}"
  style="font-size: {fontSize}; max-width: {room}cqi">{text}</span
>
