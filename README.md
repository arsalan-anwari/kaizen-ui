# kaizen-ui

A UI kit for Svelte 5 language-learning apps: washi-paper theme, chunky
touch-friendly controls, and small runtime pieces (sounds, locale lookup, appearance, viewport).

Continuously improve your learning experience with fast, accessible components
built for web and mobile.


**[Live docs and component gallery →](https://arsalan-anwari.github.io/kaizen-ui/)**

| Light | Dark |
| --- | --- |
| ![Components in the light theme](screenshots/overview.png) | ![Components in the dark theme](screenshots/overview-dark.png) |

| Select and Calendar | Cards |
| --- | --- |
| ![Select panel open above a calendar](screenshots/select.png) | ![Card examples](screenshots/cards.png) |

| Chalkboards | Meters | Phone |
| --- | --- | --- |
| ![Board sizes](screenshots/board.png) | ![Meter tones](screenshots/progress.png) | ![Phone layout](screenshots/mobile.png) |

![Record player and waveform driven by a decoded clip](screenshots/audio.png)

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

The accent (`--brand`, `--ring`) is neutral ink: near-black on paper, white in the
dark theme. Override the variables after the import to give an app its own accent;
the high-contrast theme keeps its own yellow either way.

```css
:root:not(.dark):not(.high-contrast) {
  --brand: #1a6a4a;
  --brand-foreground: #ffffff;
  --brand-shadow: #0d4630;
  --brand-soft: color-mix(in srgb, #1a6a4a 8%, var(--surface));
  --ring: #1a6a4a;
}
```

## Components

`ActionSelect` `AppMark` `Badge` `Board` `Button` `Calendar` `Card` `Chip`
`ConfirmDialog` `CustomNumberChip` `EmptyState` `Icon` `IconButton` `Meter`
`NumberField` `NumberRoller` `OptionCard` `PageBackdrop` `PlayIcon` `Popover`
`Progress` `RecordPlayer` `RowBar` `Segmented` `Select` `Stat` `Switch`
`TextField` `TileGrid` `Waveform`

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

## Docs site

The gallery in `docs/` is a small Vite + Svelte app that imports the library
straight from `src/`. GitHub Actions publishes it to GitHub Pages on every push
to `main` (`.github/workflows/pages.yml`); enable Pages with the "GitHub
Actions" source once.

```sh
cd docs
npm install
npm run dev            # local gallery
npm run build          # static site in docs/dist
npx playwright install chromium
npm run shots          # regenerates ../screenshots from the built site
```

`Waveform` and `RecordPlayer` in the gallery run on five spoken kana clips in
`docs/public/audio`, decoded through `audioContext()` from the library's own
audio bus. The clips come from the
[Kana Sounds](https://huggingface.co/datasets/arsalan-anwari/kana-sounds) dataset,
recorded by [FUN Japanese Learning](https://funjapaneselearning.com) and used under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); they are docs assets and
are not published with the package.

## Licence

Apache-2.0
