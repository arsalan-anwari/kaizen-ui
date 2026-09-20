<script lang="ts">
  import { applyAppearance, zoomMax, zoomMin, type Theme } from "../appearance";
  import { i18n, knownLocales, setLocale } from "../i18n.svelte";
  import { prefs, prefsKey, zoomBy } from "../prefs.svelte";
  import { setEffectsEnabled } from "../sfx";
  import { storeJson } from "../storage";
  import { lockScroll } from "../lockScroll";
  import Chip from "./Chip.svelte";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";
  import Select from "./Select.svelte";
  import Switch from "./Switch.svelte";

  let {
    labels = {},
    onclose
  }: {
    /** Override any of the English defaults, e.g. from your own i18n. */
    labels?: Partial<typeof defaults>;
    onclose: () => void;
  } = $props();

  const defaults = {
    title: "Settings",
    close: "Close settings",
    theme: "Appearance",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    contrast: "High contrast",
    contrastHint: "Strong colours and heavier outlines.",
    zoom: "Text size",
    scale: "Scale",
    scaleHint: "Everything grows with the text.",
    zoomIn: "Bigger",
    zoomOut: "Smaller",
    sound: "Sound",
    effects: "Sound effects",
    effectsHint: "Short sounds on an answer and at the end of a run.",
    language: "Language",
    persist: "These stay set on this device."
  };

  const text = $derived({ ...defaults, ...labels });

  const themes: { value: Theme; label: keyof typeof defaults }[] = [
    { value: "system", label: "themeSystem" },
    { value: "light", label: "themeLight" },
    { value: "dark", label: "themeDark" }
  ];

  const locales = $derived(knownLocales());

  let panel: HTMLDialogElement;

  $effect(() => {
    panel.showModal();
  });

  // The header cluster may not be mounted, so this sheet also owns the writing
  // back of whatever it changes.
  $effect(() => {
    applyAppearance({ theme: prefs.theme, contrast: prefs.contrast, zoom: prefs.zoom });
    setEffectsEnabled(prefs.sound);
    if (locales.length > 0) setLocale(prefs.locale);
    storeJson(prefsKey, { ...prefs });
  });
</script>

<dialog
  bind:this={panel}
  class="paper fullscreen-sheet fixed inset-0 z-50 flex flex-col"
  use:lockScroll={onclose}
  aria-label={text.title}
  onclose={onclose}
>
  <header class="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
    <span class="text-h4 font-bold">{text.title}</span>
    <IconButton icon="close" label={text.close} onclick={onclose} />
  </header>

  <div
    class="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pt-5 pb-[calc(var(--nav-bar)+1.25rem)]"
  >
    <div class="flex flex-col gap-2">
      <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {text.theme}
      </span>
      <div class="grid grid-cols-3 gap-2">
        {#each themes as theme (theme.value)}
          <Chip
            size="sm"
            class="w-full"
            disabled={prefs.contrast}
            active={!prefs.contrast && prefs.theme === theme.value}
            onclick={() => (prefs.theme = theme.value)}
          >
            {text[theme.label]}
          </Chip>
        {/each}
      </div>
      <Switch
        label={text.contrast}
        hint={text.contrastHint}
        checked={prefs.contrast}
        onchange={(value) => (prefs.contrast = value)}
      />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {text.zoom}
      </span>
      <div
        class="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3"
      >
        <span class="flex flex-col gap-0.5">
          <span class="text-sm leading-tight font-semibold">{text.scale}</span>
          <span class="text-xs leading-snug text-muted-foreground">{text.scaleHint}</span>
        </span>
        <span class="flex shrink-0 items-center gap-2">
          <IconButton
            size="sm"
            icon="zoom-out"
            label={text.zoomOut}
            disabled={prefs.zoom <= zoomMin}
            onclick={() => zoomBy(-1)}
          />
          <span class="w-12 text-center text-sm font-semibold tabular-nums">
            {Math.round(prefs.zoom * 100)}%
          </span>
          <IconButton
            size="sm"
            icon="zoom-in"
            label={text.zoomIn}
            disabled={prefs.zoom >= zoomMax}
            onclick={() => zoomBy(1)}
          />
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {text.sound}
      </span>
      <Switch
        label={text.effects}
        hint={text.effectsHint}
        checked={prefs.sound}
        onchange={(value) => (prefs.sound = value)}
      />
    </div>

    {#if locales.length > 1}
      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {text.language}
        </span>
        <Select
          full
          value={prefs.locale === "auto" ? i18n.locale : prefs.locale}
          options={locales.map((locale) => ({ value: locale.tag, label: locale.name }))}
          label={text.language}
          closeLabel={text.close}
          onchange={(next) => (prefs.locale = next)}
        />
      </div>
    {/if}

    <p class="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon name="sliders" class="size-4 shrink-0" />
      {text.persist}
    </p>
  </div>
</dialog>
