<script lang="ts">
  import type { Component } from "svelte";
  import { AppControls, AppHeader, Badge, Button, PageBackdrop, Select } from "kaizen-ui";
  import Code from "./lib/Code.svelte";
  import Demo from "./lib/Demo.svelte";
  import { version } from "../../package.json";

  const demos = import.meta.glob("./demos/*.svelte", {
    eager: true,
    import: "default"
  }) as Record<string, Component>;
  const sources = import.meta.glob("./demos/*.svelte", {
    eager: true,
    query: "?raw",
    import: "default"
  }) as Record<string, string>;

  type Entry = [name: string, note: string];

  const groups: { title: string; items: Entry[] }[] = [
    {
      title: "Actions",
      items: [
        ["Button", "Seven variants, four sizes. Presses down under the thumb."],
        ["IconButton", "Icon only. The label is required, it becomes the aria-label."],
        ["Chip", "A pill that toggles. Filters, answer choices."],
        ["Badge", "Not clickable. Seven tones."]
      ]
    },
    {
      title: "Inputs",
      items: [
        ["Switch", "Fills the row, so the whole row is the hit target."],
        ["Segmented", "Pick one of a few. The Preview/Code tabs above are this."],
        ["OptionCard", "Pick one, but big enough for a thumb. For setup screens."],
        ["TextField", "Three tones: idle, correct, wrong. Turn it green when they get it right."],
        ["NumberField", "Clamps to min/max. Commits on blur or Enter, not on every keystroke."],
        ["Select", "The native select ignores your theme and Android draws its own arrow. This one doesn't. Panel on desktop, sheet on a phone."],
        ["ActionSelect", "A Select with buttons in the panel: new deck, delete deck."],
        ["Calendar", "A month grid, because input[type=date] can't be styled."],
        ["CustomNumberChip", "A Chip for when none of the presets fit. Opens a roller."],
        ["NumberRoller", "Spin to a value from a fixed list. Full sheet on a phone."]
      ]
    },
    {
      title: "Overlays",
      items: [
        ["Popover", "The panel Select, ActionSelect and Calendar all hang off."],
        ["ConfirmDialog", "Two buttons, one of them destructive. Blocks until answered."],
        ["ResultSplash", "The full-screen celebration after a run. Five grades, five particle effects. Plays over whatever is behind it and dismisses itself."]
      ]
    },
    {
      title: "Layout",
      items: [
        ["Card", "Ruled paper. Title, icon and action are all optional."],
        ["RowBar", "A list row. Give it children and it expands instead of pressing."],
        ["TileGrid", "Equal tiles, as many per row as fit."],
        ["Board", "A chalkboard for the character being drilled. Compact is the half-height shape a phone in landscape gets."],
        ["EmptyState", "What a list shows before there is anything in it."],
        ["PageBackdrop", "The illustration behind this page. Mount it once and forget it."],
        ["dismissSplash", "The pre-boot splash: markup and CSS in index.html so it paints before the bundle loads. Call this after mount to fade it out."]
      ]
    },
    {
      title: "Data",
      items: [
        ["Stat", "One number, one label, five tones."],
        ["Meter", "A gauge with the percentage spelled out. Leave the tone off and it colours by value."],
        ["Progress", "Just the bar. No label unless you pass one."]
      ]
    },
    {
      title: "Audio",
      items: [
        ["Waveform", "Bars from the clip's real peaks. Everything left of the playhead fills in."],
        ["RecordPlayer", "Waveform, play button and progress in one control. Press it."],
        ["PlayIcon", "A triangle or two bars. One playing prop swaps them."],
        ["sfx", "Oscillators, not audio files, so nothing to ship. The Sound chip mutes them."]
      ]
    },
    {
      title: "Brand",
      items: [
        ["AppHeader", "The bar every app starts with: mark, name, tabs, controls. Sizes off its own container, so it folds here the same way it folds on a phone."],
        ["AppControls", "Language, theme, contrast, sound and zoom. Owns the prefs and writes them onto the document, so dropping it in is the whole wiring."],
        ["AppMark", "One glyph in a square. Ink, or seal red."],
        ["Icon", "All 29 of them. Pass a name, get a stroke icon."]
      ]
    }
  ];

  const all = groups.flatMap((group) => group.items);
  // Every entry but `sfx` and `dismissSplash` is a component.
  const componentCount = all.length - 2;

  let active = $state(all[0][0].toLowerCase());

  // Highlights the sidebar entry for whatever sits under the sticky header.
  $effect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) active = visible[0].target.id;
      },
      { rootMargin: "-96px 0px -65% 0px" }
    );
    for (const section of document.querySelectorAll("main section[id]")) observer.observe(section);
    return () => observer.disconnect();
  });

  const activeGroup = $derived(
    groups.find((group) => group.items.some(([name]) => name.toLowerCase() === active))?.title ??
      groups[0].title
  );

  // The sidebar is taller than its own viewport, so follow the active entry.
  $effect(() => {
    document.querySelector(`nav a[href="#${active}"]`)?.scrollIntoView({ block: "nearest" });
  });

  const installShell = "npm install kaizen-ui";
  const installCss = `@import "tailwindcss";
@import "kaizen-ui/theme.css";
@source "../node_modules/kaizen-ui/src";`;
</script>

<PageBackdrop />

<AppHeader
  glyph="改"
  title="kaizen-ui"
  subtitle="Svelte 5 UI kit · v{version}"
  width="max-w-7xl"
  items={groups.map((group) => ({ value: group.title, label: group.title }))}
  value={activeGroup}
  onpick={(title) => {
    const group = groups.find((entry) => entry.title === title);
    if (group !== undefined) window.location.hash = group.items[0][0].toLowerCase();
  }}
/>

<div id="top" class="relative z-10 mx-auto flex max-w-7xl gap-10 px-4 pt-2 pb-10 sm:px-6">
  <nav
    class="sticky top-28 hidden h-[calc(100dvh-8rem)] w-52 shrink-0 overflow-y-auto pb-8 lg:block"
  >
    {#each groups as group (group.title)}
      <p class="mt-5 mb-1.5 text-xs font-bold tracking-wide text-foreground/70 uppercase first:mt-0">
        {group.title}
      </p>
      <ul class="flex flex-col gap-0.5 text-sm">
        {#each group.items as [name] (name)}
          {@const id = name.toLowerCase()}
          <li>
            <a
              class="block rounded-lg px-2.5 py-1 hover:bg-accent {active === id
                ? 'bg-selected-soft font-bold text-foreground'
                : 'text-foreground/80'}"
              href="#{id}"
            >
              {name}
            </a>
          </li>
        {/each}
      </ul>
    {/each}
  </nav>

  <main class="flex min-w-0 flex-1 flex-col gap-12">
    <section class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <h1 class="text-h1 font-bold tracking-tight">Kaizen UI</h1>
        <p class="max-w-2xl text-body text-foreground/80">
            A UI kit for Svelte 5 language-learning apps: washi-paper theme, chunky touch-friendly controls, and small runtime pieces (sounds, locale lookup, appearance, viewport)
        </p>
        <div class="flex flex-wrap gap-2">
          <Badge tone="brand">{componentCount} components</Badge>
          <Badge tone="outline">Svelte 5 runes</Badge>
          <Badge tone="outline">Tailwind 4</Badge>
          <Badge tone="outline">No runtime dependencies</Badge>
          <Badge tone="seal">Apache-2.0</Badge>
        </div>

        <div class="flex flex-col gap-3 lg:hidden">
          <Select
            value={active}
            options={all.map(([name]) => ({ value: name.toLowerCase(), label: name }))}
            label="Jump to a component"
            closeLabel="Close"
            full
            onchange={(v) => {
              window.location.hash = v;
            }}
          />
          <AppControls />
        </div>
        <Button
          variant="outline"
          size="sm"
          class="self-start"
          onclick={() => window.open("https://github.com/arsalan-anwari/kaizen-ui", "_blank")}
        >
          GitHub
        </Button>
      </div>

      <div class="grid items-start gap-4 sm:grid-cols-2">
        <div class="overflow-hidden rounded-2xl border-2 border-border bg-surface">
          <p class="border-b-2 border-border px-4 py-2.5 text-sm font-bold">Install</p>
          <Code code={installShell} lang="bash" />
        </div>
        <div class="overflow-hidden rounded-2xl border-2 border-border bg-surface">
          <p class="border-b-2 border-border px-4 py-2.5 text-sm font-bold">Then in app.css</p>
          <Code code={installCss} lang="css" />
        </div>
      </div>
    </section>

    {#each groups as group (group.title)}
      <section class="flex flex-col gap-10">
        <h2 class="text-h2 font-bold tracking-tight border-b-2 border-border pb-2">
          {group.title}
        </h2>
        {#each group.items as [name, note] (name)}
          <Demo
            {name}
            {note}
            demo={demos[`./demos/${name}.svelte`]}
            source={sources[`./demos/${name}.svelte`]}
          />
        {/each}
      </section>
    {/each}

    <footer class="flex flex-col gap-1 border-t-2 border-border pt-6 pb-10 text-sm text-foreground/75">
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
