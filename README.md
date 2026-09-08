# kaizen-ui

A UI kit for Svelte 5 language-learning apps: washi-paper theme, chunky
touch-friendly controls, and small runtime pieces (sounds, locale lookup, appearance, viewport).

Continuously improve your learning experience with fast, accessible components
built for web and mobile.

## Install

```sh
npm install kaizen-ui
```

The package ships Svelte source, so the consuming app compiles it. With Vite,
exclude it from pre-bundling:

```js
optimizeDeps: { exclude: ["kaizen-ui"] }
```

## Theme

```css
@import "tailwindcss";
@import "kaizen-ui/theme.css";
@source "../node_modules/kaizen-ui/src";
```

## Components

`ActionSelect` `AppMark` `Badge` `Board` `Button` `Calendar` `Card` `Chip`
`ConfirmDialog` `CustomNumberChip` `EmptyState` `Icon` `IconButton` `Meter`
`NumberRoller` `OptionCard` `PlayIcon` `Popover` `Progress` `RowBar` `Segmented`
`Select` `Stat` `Switch` `TextField` `Waveform`

`Select` and `Calendar` replace the native `<select>` and `<input type="date">`,
whose popups the operating system draws in its own style. Both hang off
`Popover`, which anchors a panel beside its trigger on a wide viewport and turns
it into a fullscreen sheet on a phone.


## Runtime

```ts
import { bundlesFromGlob, registerLocales, setLocale } from "kaizen-ui";

registerLocales({
  bundles: bundlesFromGlob(
    import.meta.glob("./locales/*/*.json", { eager: true, import: "default" })
  ),
  locales: [{ tag: "en", name: "English" }],
  fallback: "en"
});
setLocale("auto");
```

## Licence

Apache-2.0
