# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
