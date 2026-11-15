# Changelog

## [0.1.0] - Initial Unified Manifest V3 Release

### Added
- **Unified V3 / V4 Runtime**: Automatic major-version detection (`GeoFS 3.x` and `4.x`, ignoring minor versions) via `SimAdapter`.
- **Dual-World MV3 Architecture**: `MAIN` world simulator integration paired with an `ISOLATED` world `chrome.storage` bridge.
- **Centralized TelemetryBus & ModuleManager**: Single `requestAnimationFrame` loop and strict `init` / `update` / `destroy` contracts for leak-free hot-toggling.
- **10 Modular Addons**: Autothrottle (aircraft-class PID presets), Information Display (multi-engine `% THR` & `[REV]`), Fuel Simulator, Overpowered Engines, Type-Aware Checklist System, Realism Pack (adaptive GLSL 3.00 ES / 1.00 shaders), Failure Simulator, SVG Flight Path Vector, Landing Statistics + Logbook, and Configurable Satellite Imagery.
- **Preact + TypeScript Popup UI**: Module toggles & presets, Day/Night dynamic theming synced to GeoFS time, Screen Calibrator (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), OS-aware keybindings, and persistent landing logbook.
- **Extension Icons & Packaging**: Bundled `16x16`, `48x48`, and `128x128` PNG icons and zip release packaging.
