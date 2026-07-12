# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-07-12

### Added

- Accessibility — the frequency-response graph is now legible to screen readers. The root SVG is a labelled `role="group"` (new `ariaLabel` prop on `FrequencyResponseGraph`, default `"Frequency response graph"`), and every `FilterPoint` is announced as an image describing its current settings (type, frequency, gain, Q). Decorative grids, response curves, and the pointer readout are hidden from assistive tech.

### Fixed

- Reverted the 0.7.2 `CompositeCurve` magnitude-cache change, which caused a 2-3x drag/animation performance regression. The 0.7.1 deferred-effect caching is restored, and a code comment now documents why that work must stay off the render path.

_Adds the `ariaLabel` prop to `FrequencyResponseGraph`; no breaking changes._

## [0.7.2] - 2026-07-11

### Fixed

- `FilterPoint` no longer re-attaches its wheel (Q-adjust) listener on every render — it is now managed in an effect with cleanup, fixing listener accumulation and stale-value closures
- `CompositeCurve` now rebuilds its magnitude cache when the graph is resized or the scale changes (the cache previously keyed only on filters, leaving a stale curve after a resize) — **reverted in 0.8.0: this change caused a drag/animation performance regression**

### Changed

- Reverted the 0.7.1 composite-magnitude guard back to the original falsy check (the change was output-neutral)
- The published bundle is now minified
- Documented `calcStandardDeviation` as a public helper
- Dev tooling: switched to `@vitejs/plugin-react`, disabled Storybook's onboarding UI, and aligned the README/Introduction taglines

_No public API changes._

## [0.7.1] - 2026-07-11

### Fixed

- SSR-safe graph id via `useId()` (previously `Math.random()`, which caused hydration mismatches)
- Composite curve no longer drops filters sitting at exactly 0 dB
- `FilterPoint` renders a custom `label` as text instead of raw HTML (XSS)
- Unknown filter types now throw instead of logging to the console
- `import 'dsssp/font'` types now resolve (the `./font` export was missing `dist/font.d.ts`)
- Corrected the `useGraph` "must be used within …" error message

### Changed

- Memoized theme/scale deep-merges in `FrequencyResponseGraph` (no re-clone on every render/drag)
- Replaced magic numbers with named constants; internal parameter renames
- The published package no longer ships the test setup or `.d.ts.map` files
- README: absolute image URLs (fixes broken images on npm), Components / Use cases sections, and badges
- Added a CI workflow (lint, build, tests)

_No public API changes._

## [0.7.0] - 2026-07-10

### Changed

- Relicensed from AGPL-3.0 to the permissive [MIT](LICENSE) license — free to use in personal, open-source, and commercial projects
- Modernized the toolchain: Storybook 10, Vite 8, Vitest 4, latest TypeScript 5.x, and React 19 type definitions (Tailwind remains 3)
- Refreshed the README, package metadata, and documentation

_No public API changes._

## [0.6.4] - 2025-03-29

### Fixed

- Declaration file generation

### Changed

- Updated dependencies

## [0.6.3] - 2025-02-27

### Added

- React 19 support

### Changed

- Updated dependencies

## [0.6.2] - 2025-02-25

### Fixed

- Curve animation flickering in mobile Safari

## [0.6.1] - 2025-02-23

### Fixed

- Webkit browsers didn't use `keySplines` for SVG animations without `keyTimes` property
- Removed unsupported easing types from the library

## [0.6.0] - 2025-02-23

### Added

- Native SVG path animations for filter curves (`animate`/`easing`/`duration` props for all curves)
- Every curve now has an initial path on mount
- Dotted line style option now works for all curves
- Control over dB/Gain labels (`dbLabels` prop in GraphScale)

### Changed

- Updated dependencies
- Added caching to GraphProvider
- Optimized curve rendering performance
- Refactored internal path calculation logic

## [0.5.0] - 2025-02-16

[Initial documented version]
