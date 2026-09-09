<script lang="ts">
  import {
    ActionSelect,
    AppMark,
    Badge,
    Board,
    Button,
    Calendar,
    Card,
    Chip,
    ConfirmDialog,
    CustomNumberChip,
    EmptyState,
    Icon,
    IconButton,
    Meter,
    NumberField,
    NumberRoller,
    OptionCard,
    PageBackdrop,
    PlayIcon,
    Popover,
    Progress,
    RecordPlayer,
    RowBar,
    Segmented,
    Select,
    Stat,
    Switch,
    TextField,
    TileGrid,
    Waveform,
    applyAppearance,
    audioContext,
    fanfareGrades,
    setEffectsEnabled,
    sfx,
    type IconName,
    type Theme
  } from "kaizen-ui";

  const iconNames: IconName[] = [
    "sun", "moon", "monitor", "select-all", "select-none", "folder-open", "download",
    "trash", "plus", "save", "restore", "filter", "calendar", "chevron-down",
    "chevron-right", "chevron-left", "sliders", "contrast", "volume-on", "volume-off",
    "zoom-in", "zoom-out", "close", "check", "flame", "sprout", "target", "trophy", "info"
  ];

  const sections = [
    "Button", "IconButton", "Chip", "Badge", "Switch", "Segmented", "OptionCard",
    "TextField", "NumberField", "Select", "ActionSelect", "Calendar", "CustomNumberChip",
    "NumberRoller", "Popover", "ConfirmDialog", "Card", "RowBar", "Stat", "Meter",
    "Progress", "Waveform", "RecordPlayer", "PlayIcon", "Board", "TileGrid",
    "EmptyState", "AppMark", "Icon", "PageBackdrop", "sfx"
  ];

  // Five spoken kana clips, decoded on the library's own audio bus: the peaks
  // drive Waveform and RecordPlayer, the same buffer plays back through it.
  const clips = ["a", "ka", "shi", "tsu", "n"] as const;
  const kana: Record<string, string> = { a: "あ", ka: "か", shi: "し", tsu: "つ", n: "ん" };
  const flat = Array.from({ length: 48 }, () => 0.12);
  const buffers = new Map<string, AudioBuffer>();

  let clip = $state<string>("a");
  let peaks = $state<number[]>(flat);
  let progress = $state(0);
  let playing = $state(false);
  let source: AudioBufferSourceNode | null = null;

  function peaksOf(buffer: AudioBuffer, count = 48): number[] {
    const data = buffer.getChannelData(0);
    const step = Math.max(1, Math.floor(data.length / count));
    return Array.from({ length: count }, (_, bucket) => {
      let peak = 0;
      const end = Math.min(data.length, (bucket + 1) * step);
      for (let i = bucket * step; i < end; i += 1) peak = Math.max(peak, Math.abs(data[i]));
      return Math.min(1, peak * 1.4);
    });
  }

  async function load(name: string): Promise<AudioBuffer | null> {
    const context = audioContext();
    if (context === null) return null;
    const cached = buffers.get(name);
    if (cached !== undefined) return cached;
    const bytes = await fetch(`${import.meta.env.BASE_URL}audio/${name}.mp3`).then((r) =>
      r.arrayBuffer()
    );
    const buffer = await context.decodeAudioData(bytes);
    buffers.set(name, buffer);
    return buffer;
  }


  async function playClip(): Promise<void> {
    const context = audioContext();
    const buffer = await load(clip);
    if (context === null || buffer === null) return;
    source?.stop();
    if (context.state !== "running") await context.resume();
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    const startedAt = context.currentTime;
    source.onended = () => {
      playing = false;
      progress = 0;
    };
    source.start();
    playing = true;
    const tick = (): void => {
      if (!playing) return;
      progress = Math.min(1, (context.currentTime - startedAt) / buffer.duration);
      requestAnimationFrame(tick);
    };
    tick();
  }

  $effect(() => {
    const name = clip;
    progress = 0;
    void load(name).then((buffer) => {
      if (name === clip) peaks = buffer === null ? flat : peaksOf(buffer);
    });
  });

  let theme = $state<Theme>("light");
  let contrast = $state(false);
  let sound = $state(true);

  $effect(() => {
    applyAppearance({ theme, contrast, zoom: 1 });
  });
  $effect(() => {
    setEffectsEnabled(sound);
  });

  let chip = $state("hiragana");
  let switched = $state(true);
  let mode = $state<"read" | "write">("read");
  let option = $state("daily");
  let text = $state("");
  let count = $state(12);
  let level = $state("n5");
  let action = $state("");
  let day = $state("");
  let minutes = $state(15);
  let roller = $state(false);
  let rolled = $state(20);
  let confirming = $state(false);
  let confirmed = $state("");
  let anchor = $state<HTMLElement | null>(null);
  let popped = $state(false);
  let rowOpen = $state(false);
</script>

<PageBackdrop />

<div class="relative z-10 mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
  <nav class="sticky top-8 hidden h-[calc(100dvh-6rem)] w-44 shrink-0 overflow-y-auto lg:block">
    <p class="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">Components</p>
    <ul class="flex flex-col gap-0.5 text-sm">
      {#each sections as name (name)}
        <li>
          <a class="block rounded-lg px-2 py-1 hover:bg-accent" href="#{name.toLowerCase()}">
            {name}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <main class="flex min-w-0 flex-1 flex-col gap-8">
    <header class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <AppMark glyph="改" class="size-12" />
        <div>
          <h1 class="text-h1 font-bold tracking-tight">kaizen-ui</h1>
          <p class="text-sm text-muted-foreground">
            A UI kit for Svelte 5 language-learning apps: washi-paper theme, chunky
            touch-friendly controls.
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Segmented
          items={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
            { value: "contrast", label: "Contrast" }
          ]}
          value={contrast ? "contrast" : theme}
          onpick={(v) => {
            contrast = v === "contrast";
            if (!contrast) theme = v as Theme;
          }}
        />
        <Chip active={sound} size="sm" onclick={() => (sound = !sound)}>Sound</Chip>
        <Button
          variant="outline"
          size="sm"
          onclick={() => window.open("https://github.com/arsalan-anwari/kaizen-ui", "_blank")}
        >
          GitHub
        </Button>
      </div>
      <Card title="Install" description="The package ships Svelte source; the app compiles it.">
        <pre class="overflow-x-auto rounded-xl bg-muted p-3 text-xs leading-relaxed"><code
            >npm install kaizen-ui

/* app.css */
@import "tailwindcss";
@import "kaizen-ui/theme.css";
@source "../node_modules/kaizen-ui/src";</code
          ></pre>
      </Card>
    </header>

    {#snippet demo(id: string, note: string, body: import("svelte").Snippet)}
      <section id={id.toLowerCase()} class="scroll-mt-6">
        <h2 class="text-h3 font-bold tracking-tight">{id}</h2>
        <p class="mb-3 text-sm text-muted-foreground">{note}</p>
        <div class="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-border bg-surface p-5">
          {@render body()}
        </div>
      </section>
    {/snippet}

    {#snippet buttons()}
      <Button>Primary</Button>
      <Button variant="brand">Brand</Button>
      <Button variant="seal">Seal</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra</Button>
      <Button disabled>Disabled</Button>
    {/snippet}
    {@render demo("Button", "Seven variants, four sizes, pressable lip shadow.", buttons)}

    {#snippet iconButtons()}
      <IconButton icon="plus" label="Add" />
      <IconButton icon="save" label="Save" active />
      <IconButton icon="sliders" label="Settings" variant="ghost" />
      <IconButton icon="trash" label="Delete" variant="danger" />
      <IconButton icon="close" label="Close" size="sm" />
      <IconButton icon="download" label="Download" disabled />
    {/snippet}
    {@render demo("IconButton", "Square icon-only button with a required label.", iconButtons)}

    {#snippet chips()}
      {#each ["hiragana", "katakana", "kanji"] as name (name)}
        <Chip active={chip === name} onclick={() => (chip = name)}>{name}</Chip>
      {/each}
      <Chip size="sm">small</Chip>
      <Chip disabled>disabled</Chip>
    {/snippet}
    {@render demo("Chip", "Toggleable pill for filters and answer choices.", chips)}

    {#snippet badges()}
      <Badge>default</Badge>
      <Badge tone="outline">outline</Badge>
      <Badge tone="success">success</Badge>
      <Badge tone="danger">danger</Badge>
      <Badge tone="brand">brand</Badge>
      <Badge tone="seal">seal</Badge>
      <Badge tone="gold">gold</Badge>
    {/snippet}
    {@render demo("Badge", "Static label in seven tones.", badges)}

    {#snippet switches()}
      <div class="w-full max-w-sm">
        <Switch
          checked={switched}
          label="Sound effects"
          hint="Plays a click on every answer"
          onchange={(v) => (switched = v)}
        />
      </div>
    {/snippet}
    {@render demo("Switch", "Row-wide toggle with label and hint.", switches)}

    {#snippet segmented()}
      <Segmented
        items={[
          { value: "read", label: "Reading" },
          { value: "write", label: "Writing" }
        ]}
        value={mode}
        size="md"
        onpick={(v) => (mode = v)}
      />
      <span class="text-sm text-muted-foreground">picked: {mode}</span>
    {/snippet}
    {@render demo("Segmented", "Exclusive choice with a sliding thumb.", segmented)}

    {#snippet optionCards()}
      <div class="grid w-full gap-3 sm:grid-cols-3">
        {#each [["daily", "10 minutes a day"], ["weekly", "One long session"], ["free", "No goal"]] as [value, hint] (value)}
          <OptionCard
            label={value}
            {hint}
            active={option === value}
            onclick={() => (option = value)}
          />
        {/each}
      </div>
    {/snippet}
    {@render demo("OptionCard", "Big tappable card for one-of-many setup choices.", optionCards)}

    {#snippet textFields()}
      <div class="grid w-full gap-3 sm:grid-cols-3">
        <TextField bind:value={text} placeholder="Type an answer" />
        <TextField value="correct" tone="correct" />
        <TextField value="wrong" tone="wrong" />
      </div>
      <TextField value="" placeholder="big" big />
    {/snippet}
    {@render demo("TextField", "Answer input with idle, correct and wrong tones.", textFields)}

    {#snippet numberFields()}
      <NumberField
        value={count}
        min={1}
        max={99}
        label="Questions"
        unit="cards"
        oncommit={(v) => (count = v)}
      />
      <span class="text-sm text-muted-foreground">value: {count}</span>
    {/snippet}
    {@render demo("NumberField", "Clamped numeric input, commits on blur or Enter.", numberFields)}

    {#snippet selects()}
      <Select
        bind:value={level}
        options={[
          { value: "n5", label: "N5 — beginner" },
          { value: "n4", label: "N4" },
          { value: "n3", label: "N3" }
        ]}
        label="Level"
        closeLabel="Close"
      />
      <Select
        value=""
        options={[{ value: "a", label: "Option A" }]}
        label="Small"
        placeholder="Pick one"
        size="sm"
        closeLabel="Close"
      />
      <Select value="" options={[]} label="Disabled" placeholder="None" disabled closeLabel="Close" />
    {/snippet}
    {@render demo(
      "Select",
      "Replaces the native select: anchored panel on desktop, sheet on a phone.",
      selects
    )}

    {#snippet actionSelects()}
      <div class="w-full max-w-sm">
        <ActionSelect
          bind:value={action}
          options={["Kanji set 1", "Kanji set 2"]}
          label="Deck"
          empty="No deck"
          closeLabel="Close"
          actions={[
            { icon: "plus", label: "New deck", onclick: () => (action = "Kanji set 3") },
            { icon: "trash", label: "Delete deck", disabled: action === "", onclick: () => (action = "") }
          ]}
        />
      </div>
    {/snippet}
    {@render demo("ActionSelect", "A select whose panel also carries row actions.", actionSelects)}

    {#snippet calendars()}
      <div class="w-full max-w-xs">
        <Calendar bind:value={day} />
      </div>
      <span class="text-sm text-muted-foreground">picked: {day === "" ? "—" : day}</span>
    {/snippet}
    {@render demo("Calendar", "Themed month grid, replaces input[type=date].", calendars)}

    {#snippet customChips()}
      <CustomNumberChip
        value={minutes}
        min={5}
        max={60}
        unit="min"
        title="Session length"
        doneLabel="Done"
        cancelLabel="Cancel"
        active
        onpick={(v) => (minutes = v)}
      />
    {/snippet}
    {@render demo("CustomNumberChip", "Chip that opens a roller for a custom value.", customChips)}

    {#snippet rollers()}
      <Button variant="outline" onclick={() => (roller = true)}>Pick a number ({rolled})</Button>
      {#if roller}
        <NumberRoller
          values={[10, 20, 30, 40, 50]}
          value={rolled}
          title="Cards per session"
          doneLabel="Done"
          cancelLabel="Cancel"
          onpick={(v) => {
            rolled = v;
            roller = false;
          }}
          onclose={() => (roller = false)}
        />
      {/if}
    {/snippet}
    {@render demo("NumberRoller", "Scroll wheel for a value from a fixed list.", rollers)}

    {#snippet popovers()}
      <div bind:this={anchor} class="inline-block">
        <Button variant="outline" onclick={() => (popped = !popped)}>Open popover</Button>
      </div>
      {#if popped}
        <Popover {anchor} label="Details" closeLabel="Close" onclose={() => (popped = false)}>
          {#snippet children(close)}
            <div class="flex flex-col gap-3 p-4">
              <p class="text-sm">Anchored beside the trigger on a wide screen, fullscreen on a phone.</p>
              <Button size="sm" onclick={close}>Got it</Button>
            </div>
          {/snippet}
        </Popover>
      {/if}
    {/snippet}
    {@render demo("Popover", "The panel Select and Calendar hang off.", popovers)}

    {#snippet confirms()}
      <Button variant="danger" onclick={() => (confirming = true)}>Delete deck</Button>
      <span class="text-sm text-muted-foreground">{confirmed}</span>
      {#if confirming}
        <ConfirmDialog
          title="Delete this deck?"
          confirmLabel="Delete"
          cancelLabel="Keep"
          closeLabel="Close"
          onconfirm={() => {
            confirmed = "deleted";
            confirming = false;
          }}
          oncancel={() => {
            confirmed = "kept";
            confirming = false;
          }}
        >
          Every card in it goes too. This cannot be undone.
        </ConfirmDialog>
      {/if}
    {/snippet}
    {@render demo("ConfirmDialog", "Modal for a destructive choice.", confirms)}

    {#snippet cards()}
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <Card title="Today" description="Cards due before midnight">
          {#snippet icon()}<Icon name="target" class="size-5" />{/snippet}
          {#snippet action()}<Badge tone="brand">12</Badge>{/snippet}
          <p class="text-sm text-muted-foreground">Ruled paper sheet with an optional icon and action.</p>
        </Card>
        <Card>
          <p class="text-sm text-muted-foreground">Headerless card: children only.</p>
        </Card>
      </div>
    {/snippet}
    {@render demo("Card", "Ruled paper sheet with header, icon and action slots.", cards)}

    {#snippet rows()}
      <div class="w-full max-w-md">
        <RowBar label="Reading drill" hint="20 cards" bind:open={rowOpen} active={rowOpen}>
          <p class="px-4 pb-3 text-sm text-muted-foreground">
            Expanded content lives here.
          </p>
        </RowBar>
      </div>
    {/snippet}
    {@render demo("RowBar", "List row that presses, or expands to reveal content.", rows)}

    {#snippet stats()}
      <Stat value="128" label="Cards" icon="target" />
      <Stat value="7" label="Streak" icon="flame" tone="brand" />
      <Stat value="93%" label="Accuracy" icon="check" tone="success" />
      <Stat value="4" label="Trophies" icon="trophy" tone="gold" />
      <Stat value="N5" label="Level" icon="sprout" tone="seal" />
    {/snippet}
    {@render demo("Stat", "Number tile in five tones.", stats)}

    {#snippet meters()}
      <div class="grid w-full gap-4 sm:grid-cols-3">
        <Meter value={0.3} label="Recall" caption="last 7 days" />
        <Meter value={0.65} label="Speed" tone="brand" />
        <Meter value={0.92} label="Accuracy" tone="success" size="lg" />
      </div>
    {/snippet}
    {@render demo("Meter", "Labelled gauge; the heat tone colours by value.", meters)}

    {#snippet progresses()}
      <div class="flex w-full flex-col gap-3">
        <Progress value={0.25} label="Session" />
        <Progress value={0.5} tone="primary" size="sm" />
        <Progress value={0.75} tone="success" size="lg" />
        <Progress value={0.4} tone="seal" />
      </div>
    {/snippet}
    {@render demo("Progress", "Plain bar in five tones and three sizes.", progresses)}

    {#snippet waveforms()}
      <div class="flex w-full flex-wrap items-center gap-2">
        {#each clips as name (name)}
          <Chip size="sm" active={clip === name} onclick={() => (clip = name)}>
            {kana[name]} {name}
          </Chip>
        {/each}
        <Button size="sm" variant="outline" onclick={playClip}>
          <PlayIcon {playing} class="size-4" /> Play
        </Button>
      </div>
      <div class="w-full">
        <Waveform {peaks} {progress} class="h-14" />
      </div>
      <div class="w-full">
        <Waveform {peaks} progress={0.7} tone="success" class="h-10" />
      </div>
    {/snippet}
    {@render demo(
      "Waveform",
      "Real peaks, decoded from the clip on the library's audio bus; the split follows playback.",
      waveforms
    )}

    {#snippet players()}
      <RecordPlayer {peaks} {progress} {playing} label="Play {clip}" onplay={playClip} />
      <RecordPlayer {peaks} {progress} {playing} compact label="Play {clip}" onplay={playClip} />
      <div class="flex flex-col gap-2">
        {#each clips as name (name)}
          <Chip size="sm" active={clip === name} onclick={() => (clip = name)}>
            {kana[name]} {name}
          </Chip>
        {/each}
      </div>
    {/snippet}
    {@render demo(
      "RecordPlayer",
      "Turntable transport; press it to hear the picked kana.",
      players
    )}

    {#snippet playIcons()}
      <PlayIcon class="size-8" />
      <PlayIcon playing class="size-8" />
      <PlayIcon {playing} class="size-8" />
    {/snippet}
    {@render demo("PlayIcon", "Play/pause glyph that morphs between states.", playIcons)}

    {#snippet boards()}
      <Board>
        <span class="text-board-foreground text-h1 font-bold">日</span>
      </Board>
      <Board size="lg" guide={false}>
        <span class="text-board-foreground text-h1 font-bold">本</span>
      </Board>
      <Board compact>
        <span class="text-board-foreground text-h3 font-bold">語</span>
      </Board>
    {/snippet}
    {@render demo("Board", "Chalkboard panel for the character being drilled.", boards)}

    {#snippet grids()}
      <div class="w-full">
        <TileGrid>
          {#each ["あ", "い", "う", "え", "お", "か", "き", "く"] as glyph (glyph)}
            <Chip>{glyph}</Chip>
          {/each}
        </TileGrid>
      </div>
    {/snippet}
    {@render demo("TileGrid", "Auto-fitting grid of equal tiles.", grids)}

    {#snippet empties()}
      <div class="w-full">
        <EmptyState icon="sprout" title="No decks yet" hint="Make one to start drilling.">
          {#snippet action()}<Button size="sm">New deck</Button>{/snippet}
        </EmptyState>
      </div>
    {/snippet}
    {@render demo("EmptyState", "Placeholder for an empty list.", empties)}

    {#snippet marks()}
      <AppMark glyph="改" />
      <AppMark glyph="善" tone="seal" class="size-14" />
    {/snippet}
    {@render demo("AppMark", "Square app glyph in ink or seal.", marks)}

    {#snippet icons()}
      <div class="grid w-full grid-cols-4 gap-3 sm:grid-cols-8">
        {#each iconNames as name (name)}
          <div class="flex flex-col items-center gap-1 text-[0.65rem] text-muted-foreground">
            <Icon {name} class="size-6" />
            {name}
          </div>
        {/each}
      </div>
    {/snippet}
    {@render demo("Icon", "The 29 built-in icons.", icons)}

    {#snippet backdrops()}
      <p class="text-sm text-muted-foreground">
        The classroom illustration behind this page is <code>PageBackdrop</code>: a fixed,
        pointer-transparent layer that fades with the theme.
      </p>
    {/snippet}
    {@render demo("PageBackdrop", "Fixed illustration layer behind the app.", backdrops)}

    {#snippet effects()}
      {#each ["click", "select", "correct", "wrong", "tick", "start"] as name (name)}
        <Button
          size="sm"
          variant="outline"
          silent
          onclick={() => sfx[name as "click"]()}
        >
          {name}
        </Button>
      {/each}
      {#each fanfareGrades as grade (grade)}
        <Button size="sm" variant="ghost" silent onclick={() => sfx.score(grade)}>{grade}</Button>
      {/each}
    {/snippet}
    {@render demo(
      "sfx",
      "Synthesised interface sounds from the runtime; the Sound chip above mutes them.",
      effects
    )}

    <footer class="flex flex-col gap-1 pb-10 text-sm text-muted-foreground">
      <span>
        Kana clips from the
        <a class="underline" href="https://huggingface.co/datasets/arsalan-anwari/kana-sounds">
          Kana Sounds
        </a>
        dataset, recorded by
        <a class="underline" href="https://funjapaneselearning.com">FUN Japanese Learning</a>,
        <a class="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
      </span>
      <span>
        Apache-2.0 ·
        <a class="underline" href="https://github.com/arsalan-anwari/kaizen-ui">source on GitHub</a>
      </span>
    </footer>
  </main>
</div>
