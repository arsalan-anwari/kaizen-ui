<script lang="ts" module>
  let canvas: CanvasRenderingContext2D | null | undefined;

  // Glyphs line-break:strict keeps off the start of a line, so they break
  // together with the glyph before them.
  const TRAILING =
    /[ーぁぃぅぇぉっゃゅょゎゕゖァィゥェォッャュョヮヵヶ、。，．・：；？！）」』】〉》]/;

  // The runs a line may break between: words in spaced text, glyphs in
  // Japanese.
  function pieces(text: string, japanese: boolean): string[] {
    if (!japanese) return text.split(/\s+/).filter((word) => word !== "");
    const out: string[] = [];
    for (const glyph of text) {
      if (out.length > 0 && TRAILING.test(glyph)) out[out.length - 1] += glyph;
      else out.push(glyph);
    }
    return out;
  }

  // How many lines the runs take when a line holds at most `width`, filled the
  // way the browser fills them.
  function linesAt(widths: number[], gap: number, width: number): number {
    let lines = 1;
    let line = 0;
    for (const run of widths) {
      if (line > 0 && line + gap + run > width) {
        lines += 1;
        line = run;
      } else {
        line = line > 0 ? line + gap + run : run;
      }
    }
    return lines;
  }
</script>

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
    /**
     * How wide one glyph runs, in em, until the text has been measured in its
     * own font. Full-width Japanese is 1, latin ~0.55.
     */
    em?: number;
    /** Share of the container width kept clear down each side. */
    pad?: number;
    /**
     * Most glyphs on one line before the text wraps. 0 keeps it on one line.
     * Wrapped text is fitted to the block too, so it needs a size container.
     */
    perLine?: number;
    lang?: string;
    class?: string;
  } = $props();

  let element = $state<HTMLSpanElement>();
  // How wide a string runs in the text's own face, in em; null until measured.
  // The guess from `em` is too narrow for a bold capital or an m, and
  // "December" spilled out of its tile on it.
  let ruler = $state<((part: string) => number) | null>(null);

  $effect(() => {
    void className;
    canvas ??= document.createElement("canvas").getContext("2d");
    if (element === undefined || canvas === null) return;
    const context = canvas;
    const style = getComputedStyle(element);
    // At a round 100px, so a width divides straight into em.
    const font = `${style.fontStyle} ${style.fontWeight} 100px ${style.fontFamily}`;
    let live = true;
    const measure = (): void => {
      if (!live) return;
      ruler = (part) => {
        context.font = font;
        return context.measureText(part).width / 100;
      };
    };
    measure();
    // A face still loading measures as its fallback; measure again once it is in.
    document.fonts?.load(font, text).then(measure, () => {});
    return () => {
      live = false;
    };
  });

  const japanese = $derived(lang === "ja");
  const measure = $derived(ruler ?? ((part: string) => [...part].length * em));

  // Code points, so a surrogate pair counts as the one glyph it draws as.
  const glyphs = $derived(Math.max(1, [...text].length));
  const wrap = $derived(perLine > 0 && glyphs > perLine);

  // The narrowest line, in em, that holds the text in as many lines as
  // `perLine` asks for, and how many lines that really takes once words and
  // strict breaks have had their say.
  const layout = $derived.by(() => {
    const whole = measure(text);
    if (!wrap) return { width: whole, lines: 1 };
    const widths = pieces(text, japanese).map(measure);
    const gap = japanese ? 0 : measure(" ");
    const target = Math.ceil(glyphs / perLine);
    let low = Math.max(whole / target, ...widths);
    let high = Math.max(low, whole);
    for (let step = 0; step < 16; step += 1) {
      const mid = (low + high) / 2;
      if (linesAt(widths, gap, mid) <= target) high = mid;
      else low = mid;
    }
    return { width: high, lines: linesAt(widths, gap, high) };
  });

  const room = $derived(100 - 2 * pad);

  // The longest line needs that many times the font size across the container,
  // so the size that just fits is the room divided by it, with a hair spare for
  // rounding. Wrapped lines also have to stack inside the block. The cap is what
  // stops a short text from filling the whole box.
  const fontSize = $derived(
    `min(${cap}${unit}, ${room / (layout.width * 1.02)}cqi${
      layout.lines > 1 ? `, ${room / (layout.lines * 1.15)}cqb` : ""
    })`
  );
</script>

<span
  bind:this={element}
  {lang}
  class="text-center [line-break:strict] {wrap
    ? 'leading-[1.15]'
    : 'leading-none whitespace-nowrap'} {className}"
  style="font-size: {fontSize}; max-width: {room}cqi">{text}</span
>
