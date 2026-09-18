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

The package ships Svelte source, so the consuming app compiles it. 

If using Vite, exclude it from pre-bundling:

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

`ActionSelect` `AppControls` `AppHeader` `AppMark` `Badge` `Board` `Button` `Calendar`
`Card` `Chip` `ConfirmDialog` `CustomNumberChip` `EmptyState` `Icon`
`IconButton` `Meter` `NumberField` `NumberRoller` `OptionCard` `PageBackdrop`
`Pagination` `PlayIcon` `Popover` `Progress` `RecordPlayer` `RowBar` `Segmented` `Select`
`Stat` `Switch` `TextField` `TileGrid` `Waveform`

## Keyboard

`keynav` owns the app-wide keys: `Ctrl+/` starts keyboard mode and `Ctrl+Shift+/` stops it,
`Shift+Arrow` walks sections, `Ctrl+Arrow` scrolls, `Tab` cycles inside the current section or
open dialog, and `?` sets `keynav.help` so a `ShortcutHelp` sheet can open. Forward every key
press to it once, then render the sheet off that flag:

```svelte
<svelte:window onkeydown={(event) => keynav.handle(event)} />

<KeyNavBadge label="Keyboard mode" />

{#if keynav.help}
  <ShortcutHelp title="Keyboard shortcuts" closeLabel="Close" groups={[
    { title: "Menus and pages", items: keynavShortcuts(labels) }
  ]} onclose={() => (keynav.help = false)} />
{/if}
```

`keynavShortcuts` returns the rows describing those bindings, so the keys stay next to the code
that implements them and the app only supplies translated labels. Give one `AppHeader` per page
`paging` and it walks its own tabs on `Ctrl+Left` / `Ctrl+Right` and on sideways swipes.

Desktop only: on a touch screen `keynav.available` is false and the mode never starts. Outside
the mode only `Ctrl+/`, `?` and dialog trapping are live, so the keys below stay out of the way
of the browser until asked for. The docs page runs the whole set, so every row is testable at
[the live gallery](https://arsalan-anwari.github.io/kaizen-ui/).

| Key | Does |
| --- | --- |
| `Ctrl+/` | Start keyboard mode |
| `Ctrl+Shift+/` | Stop keyboard mode |
| `Shift+up` / `Shift+down` | Move between sections, the current one outlined in blue |
| `Tab` / `Shift+Tab` | Next or previous element, inside that section or the open dialog |
| `up` / `down` | First or last element of the section |
| `Ctrl+up` / `Ctrl+down` | Scroll the page |
| `Space` | Select what is focused |
| `Enter` | Confirm what is focused |
| `Ctrl+left` / `Ctrl+right` | Walk the tabs of the `paging` `AppHeader` |
| `Escape` | Close a dialog, sheet or picker |
| `?` | Show the `ShortcutHelp` sheet |

Components bring their own keys on top of that: `roving` makes a grid or strip one tab stop and
moves inside it on the arrow keys, `Home` and `End` for its edges, and in keyboard mode every
item becomes a tab stop instead. Pass your own rows to `ShortcutHelp` for whatever the app adds,
the way the gallery adds its page keys after the `keynavShortcuts` group.

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
