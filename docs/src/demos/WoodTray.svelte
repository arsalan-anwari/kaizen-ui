<script lang="ts">
  import { Glyph, sfx, WoodTray, type TrayCell } from "kaizen-ui";

  const pieces = ["亻", "木"];
  let filled = $state([false, false]);
  let selected = $state(0);

  const cells = $derived<TrayCell[]>(
    pieces.map((piece, index) => ({
      rect: [index * 2, 0, 2, 4],
      label: `${piece}, ${filled[index] ? "placed" : "empty"}`,
      filled: filled[index],
      selected: selected === index
    }))
  );

  function press(index: number): void {
    filled = filled.map((value, at) => (at === index ? !value : value));
    selected = index;
    if (filled[index]) sfx.wood.place();
    else sfx.wood.lift();
    if (filled.every(Boolean)) sfx.wood.done();
  }
</script>

<WoodTray label="休" {cells} done={filled.every(Boolean)} class="w-40" onslot={press}>
  {#snippet cell(index)}
    <Glyph text={pieces[index]} class="text-h2" />
  {/snippet}
  {#snippet glyph()}
    <Glyph text="休" class="text-[6rem] leading-none" />
  {/snippet}
</WoodTray>
