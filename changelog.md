# Changelog

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

## [0.2.0] - Aircraft Profiles And Landing Replay

### Added

- Rotorcraft classification, collective and available torque readings, and helicopter checklists.
- Aircraft V-speed references in Information Display and Checklist System, with synced per-aircraft overrides in Setup.
- Approach and touchdown telemetry exports in JSON and CSV from the Logbook.
- A popup reminder to reload open GeoFS tabs after installing or updating the extension.

### Changed

- Restored archived Autothrottle PID behavior, reverse thrust and automatic engine boost, with live module cleanup.
- Restored thrust, ceiling and stability controls, fuel options, aircraft checklist procedures, and the original touchdown grading and scoring formulas.
- Ported aircraft system failures and Realism Pack effects into the shared extension telemetry loop.

### Fixed

- Popup appearance now supports Dark, Light, and Auto (System). The in-game panel follows GeoFS local time.

## [0.1.0] - Initial Unified Manifest V3 Release

### Added
- **Unified V3 / V4 Runtime**: Automatic major-version detection (`GeoFS 3.x` and `4.x`, ignoring minor versions) via `SimAdapter`.
- **Dual-World MV3 Architecture**: `MAIN` world simulator integration paired with an `ISOLATED` world `chrome.storage` bridge.
- **Centralized TelemetryBus & ModuleManager**: Single `requestAnimationFrame` loop and strict `init` / `update` / `destroy` contracts for leak-free hot-toggling.
- **10 Modular Addons**: Autothrottle (aircraft-class PID presets), Information Display (multi-engine `% THR` & `[REV]`), Fuel Simulator, Overpowered Engines, Type-Aware Checklist System, Realism Pack (adaptive GLSL 3.00 ES / 1.00 shaders), Failure Simulator, SVG Flight Path Vector, Landing Statistics + Logbook, and Configurable Satellite Imagery.
- **Preact + TypeScript Popup UI**: Module toggles & presets, Day/Night dynamic theming synced to GeoFS time, Screen Calibrator (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), OS-aware keybindings, and persistent landing logbook.
- **Extension Icons & Packaging**: Bundled `16x16`, `48x48`, and `128x128` PNG icons and zip release packaging.
