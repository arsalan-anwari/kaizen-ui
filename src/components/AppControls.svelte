<script lang="ts">
  import { applyAppearance, zoomMax, zoomMin, type Theme } from "../appearance";
  import { i18n, knownLocales, setLocale } from "../i18n.svelte";
  import { prefs, prefsKey, zoomBy } from "../prefs.svelte";
  import { setEffectsEnabled } from "../sfx";
  import { storeJson } from "../storage";
  import IconButton from "./IconButton.svelte";
  import Select from "./Select.svelte";
  import type { IconName } from "./icons";

  let {
    size = "sm",
    labels = {},
    class: className = ""
  }: {
    size?: "sm" | "md";
    /** Override any of the English defaults, e.g. from your own i18n. */
    labels?: Partial<typeof defaults>;
    class?: string;
  } = $props();

  const defaults = {
    language: "Language",
    close: "Close",
    themeSystem: "Theme: follows the system",
    themeLight: "Theme: light",
    themeDark: "Theme: dark",
    themeLocked: "High contrast overrides the theme",
    contrast: "High contrast",
    soundOn: "Sound on",
    soundOff: "Sound off",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out"
  };

  const text = $derived({ ...defaults, ...labels });

  const themes: { value: Theme; icon: IconName; label: keyof typeof defaults }[] = [
    { value: "system", icon: "monitor", label: "themeSystem" },
    { value: "light", icon: "sun", label: "themeLight" },
    { value: "dark", icon: "moon", label: "themeDark" }
  ];

  const theme = $derived(themes.find((entry) => entry.value === prefs.theme) ?? themes[0]);

  // The language picker is only worth a slot once an app has registered more
  // than one locale.
  const locales = $derived(knownLocales());

  function cycleTheme(): void {
    const index = themes.findIndex((entry) => entry.value === prefs.theme);
    prefs.theme = themes[(index + 1) % themes.length].value;
  }

  $effect(() => {
    applyAppearance({ theme: prefs.theme, contrast: prefs.contrast, zoom: prefs.zoom });
    setEffectsEnabled(prefs.sound);
    if (locales.length > 0) setLocale(prefs.locale);
    storeJson(prefsKey, { ...prefs });
  });
</script>

<div class="flex items-center gap-1.5 {className}">
  {#if locales.length > 1}
    <Select
      {size}
      value={prefs.locale === "auto" ? i18n.locale : prefs.locale}
      options={locales.map((locale) => ({ value: locale.tag, label: locale.name }))}
      label={text.language}
      closeLabel={text.close}
      onchange={(next) => (prefs.locale = next)}
    />
  {/if}

  <IconButton
    {size}
    icon={theme.icon}
    label={prefs.contrast ? text.themeLocked : text[theme.label]}
    disabled={prefs.contrast}
    onclick={cycleTheme}
  />
  <IconButton
    {size}
    icon="contrast"
    label={text.contrast}
    active={prefs.contrast}
    onclick={() => (prefs.contrast = !prefs.contrast)}
  />
  <IconButton
    {size}
    icon={prefs.sound ? "volume-on" : "volume-off"}
    label={prefs.sound ? text.soundOn : text.soundOff}
    active={prefs.sound}
    onclick={() => (prefs.sound = !prefs.sound)}
  />

  <span class="ml-1.5 flex items-center gap-1.5 border-l border-border pl-1.5">
    <IconButton
      {size}
      icon="zoom-out"
      label={text.zoomOut}
      disabled={prefs.zoom <= zoomMin}
      onclick={() => zoomBy(-1)}
    />
    <span class="w-10 text-center text-xs font-semibold tabular-nums text-muted-foreground">
      {Math.round(prefs.zoom * 100)}%
    </span>
    <IconButton
      {size}
      icon="zoom-in"
      label={text.zoomIn}
      disabled={prefs.zoom >= zoomMax}
      onclick={() => zoomBy(1)}
    />
  </span>
</div>
