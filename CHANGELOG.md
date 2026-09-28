# Changelog

All notable changes to kaizen-ui, newest first. Versions step by 0.1; the patch
releases between them are folded into the minor release they belong to.

## [1.1.0] - 2026-09-28

### Added

- `Button` takes `wrap`, dropping its fixed height for a floor so a long label
  breaks onto a second line instead of spilling out of the button.
- `Board` and `ChoiceTile` take `lang` for a script that is not Japanese, and set
  `dir="auto"` so a right-to-left word reads the right way round.

### Changed

- Labels across the kit wrap and hyphenate on narrow screens rather than
  overflow: `Card`, `OptionCard`, `RowBar`, `ShelfCard`, `Stat` and `AppHeader`.
- `Segmented` wraps its tabs onto a second row instead of scrolling sideways.
- Keyboard mode captures `Tab` itself, so focus no longer drops when the mouse
  scrolls the page or when stepping past the last item on WebKitGTK. Sections
  that only wrap other sections are skipped, and the walk recovers its place
  when a re-render swaps a section out from under it.
- Docs: new `wrap`, `lang` and wrapping examples, the icon count corrected to 33,
  and refreshed screenshots.

## [1.0.0] - 2026-09-27

### Added

- A warning icon.
- `FitText`, trialled for sizing text to its box.

### Changed

- `Board` sizes its own text, so `FitText` was folded into it and removed.
- Fixed the quiz level on `ChoiceTile`.
- Docs: new examples and updated screenshots.

## 0.9.0 - 2026-09-25

### Added

- `Dialog`, `ShelfCard`, `WoodBlock`, `WoodTray` and `Strokes`.
- Right-to-left support: components lay out with logical `start`/`end` sides and
  `setLocale` sets `dir` on the document.
- Wood-knock sound effects and new animations.
- The bundled Klee One Japanese face, replacing Noto Sans JP.

### Changed

- Docs and tests for the new pieces.

## 0.8.0 - 2026-09-22

### Added

- `AreaSpark`, `AreaSparkGrid`, `BulletGraph`, `TreeTable`, `MissBoard` and
  `Projector`, for report pages and visual quizzes.
- A lightbulb icon.

### Changed

- The sunlight effect is off by default.
- Docs and tests for the new pieces.

## 0.7.0 - 2026-09-18

### Added

- `Pagination`, `ChoiceTile`, `SettingsMenu` and `FitText`.
- A Japanese fallback font for devices without one.

### Changed

- Prettier formatting in CI, and every component in the docs is now a
  keyboard-navigable section.
- Fixed keyboard registration on first start and an observer bug that broke the
  tests.

## 0.6.0 - 2026-09-17

### Added

- WCAG 2.2 AA accessibility across the kit.
- Keyboard operation mode: `keynav`, `roving`, `focusMain`, `ShortcutHelp`,
  `Announcer`, `AccuracyGrid`, `RowHeatmap` and `HeatLegend`.
- Playwright accessibility and behaviour tests, and a CI workflow.

### Changed

- Docs gained accessibility demos to showcase the new pieces.

## 0.5.0 - 2026-09-10

### Added

- Animations, `AppHeader` and the pre-boot splash screen, ported from
  kana-trainer.
- Audio demos for `Waveform` and `RecordPlayer`.

### Changed

- The docs page was rebuilt around one demo per component.

## 0.4.0 - 2026-09-09

### Added

- The docs page, and a script to record the screenshots.

### Changed

- Rules for using the kit in landscape on mobile.
- Fixed the spinner offset, added custom input fields for boxes, and made
  selection boxes fall back to the full-screen variant when there is not enough
  room below.

## 0.3.0 - 2026-09-08

### Added

- `Calendar`, `Popover` and `Select`; `ActionSelect` reworked on top of them.

### Changed

- Improvements for mobile touch screens.
- Fixed the back button closing the app instead of the open menu.

## 0.2.0 - 2026-09-07

### Added

- The base UI ported from kana-trainer: `Button`, `Card`, `Chip`, `Icon`,
  `IconButton`, `Badge`, `Board`, `Meter`, `Progress`, `RowBar`, `Segmented`,
  `Stat`, `Switch`, `TextField`, `TileGrid`, `Waveform`, `OptionCard`,
  `EmptyState`, `ConfirmDialog`, `CustomNumberChip`, `NumberRoller`, `AppMark`,
  `PageBackdrop` and `PlayIcon`.
- Half-height boards, a record-player prompt and a combined action selector.

### Changed

- Faster scrolling on mobile, and fixes for scroll flicker, scroll lock on
  popups, the status-bar gap on full-screen sheets, and padding above the status
  bar in a full-screen select.

## 0.1.0 - 2026-09-07

### Added

- Initial package scaffold and name reservation.

[1.0.0]: https://github.com/arsalan-anwari/kaizen-ui/releases/tag/v1.0.0
[1.1.0]: https://github.com/arsalan-anwari/kaizen-ui/releases/tag/v1.1.0
