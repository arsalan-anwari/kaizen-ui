<script lang="ts">
  import { Glyph, sfx, Strokes, WoodTray, type TrayCell } from "kaizen-ui";

  type Piece = { face: string; rect: TrayCell["rect"]; strokes?: string[] };

  // Side by side, a split side, and an enclosure with its inner piece nested
  // inside it: the smaller slot sits on top of the larger one.
  // `clear` drops the highlight once the tray is full, so nothing sits over
  // the finished glyph as it assembles.
  const puzzles: { glyph: string; caption: string; pieces: Piece[]; clear?: boolean }[] = [
    {
      glyph: "休",
      caption: "left and right",
      pieces: [
        { face: "亻", rect: [0, 0, 2, 4] },
        { face: "木", rect: [2, 0, 2, 4] }
      ]
    },
    {
      glyph: "語",
      caption: "split side, highlight clears when done",
      clear: true,
      pieces: [
        { face: "言", rect: [0, 0, 2, 4] },
        { face: "五", rect: [2, 0, 2, 2] },
        { face: "口", rect: [2, 2, 2, 2] }
      ]
    },
    {
      glyph: "国",
      caption: "nested",
      pieces: [
        // No font draws 囗 as a frame the size of the tray, so brush it.
        {
          face: "囗",
          rect: [0, 0, 4, 4],
          strokes: ["M12,12V88", "M12,12H88V88", "M12,88H88"]
        },
        { face: "玉", rect: [1, 1, 2, 2] }
      ]
    }
  ];

  let filled = $state(puzzles.map((puzzle) => puzzle.pieces.map(() => false)));
  let selected = $state(puzzles.map(() => 0));

  const done = (at: number): boolean => filled[at].every(Boolean);

  function cellsOf(at: number): TrayCell[] {
    const hide = puzzles[at].clear === true && done(at);
    return puzzles[at].pieces.map((piece, index) => ({
      rect: piece.rect,
      label: `${piece.face}, ${filled[at][index] ? "placed" : "empty"}`,
      filled: filled[at][index],
      selected: !hide && selected[at] === index
    }));
  }

  function press(at: number, index: number): void {
    filled[at][index] = !filled[at][index];
    selected[at] = index;
    if (filled[at][index]) sfx.wood.place();
    else sfx.wood.lift();
    if (done(at)) sfx.wood.done();
  }
</script>

<div class="flex flex-wrap items-start gap-4">
  {#each puzzles as puzzle, at (puzzle.glyph)}
    <figure class="flex flex-col items-center gap-2">
      <WoodTray
        label={puzzle.glyph}
        cells={cellsOf(at)}
        done={done(at)}
        class="w-40"
        onslot={(index) => press(at, index)}
      >
        {#snippet cell(index)}
          {@const piece = puzzle.pieces[index]}
          {#if piece.strokes}
            <Strokes strokes={piece.strokes} viewBox="0 0 100 100" class="size-full" />
          {:else}
            <Glyph text={piece.face} class="text-h2" />
          {/if}
        {/snippet}
        {#snippet glyph()}
          <Glyph text={puzzle.glyph} class="text-[6rem] leading-none" />
        {/snippet}
      </WoodTray>
      <figcaption class="text-xs text-foreground/75">{puzzle.caption}</figcaption>
    </figure>
  {/each}
</div>
