# Changelog

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

---

## [Unreleased]

### Documentation

- Added Simplified Chinese project and contribution guides and bilingual feedback templates.


### Added

- Added free live GeoFS + global **ADS-B** radar (`src/sidepanel/radar-panel.tsx`, `src/shared/global-traffic.ts`) with popout tab support and callsign watchlist.
- Added **EFB Side Panel** (`src/sidepanel/efb-panel.tsx`) with **SimBrief OFP** integration, FAA airport charts, runway crosswind calculator, and Career Jobs.
- Added **Pushback Tug**, **Pre-Flight Walkaround** (`Alt+W`), **Shortcut Cheatsheet Overlay** (`?`), **AP++ LNAV** route arc backup, and automatic **Immersive Airports** detection.
- Added unit test suite [`tests/phase3-features.test.ts`](tests/phase3-features.test.ts) covering SimBrief, ADS-B/relay traffic, airport charts, career jobs, semver update checks, pushback, walkaround, and Immersive Airports detection.

### Changed

- Restored the Star History chart section in `readme.md` and `website/src/main.ts`, updated `.github/workflows/release.yml` to use `actions/checkout@v7`, `actions/setup-node@v7`, and `softprops/action-gh-release@v3`, and tracked live V4 verification checks in `docs/live-v4-status.md` and `docs/todo.md`.
- Migrated default extension keybindings from `Shift+` to `Alt+` (`Alt+A`, `Alt+O`, `Alt+H`, `Alt+F`, `Alt+C`, `Alt+L`, `Alt+Y`, `Alt+W`) to avoid conflicts with native GeoFS controls, and harmonized the GeoFS palette across all UI surfaces.

### Fixed

- Fixed `fetchSimBriefOfp` to pass `userid=` for numeric Pilot IDs (and `username=` for string usernames) and added request timeouts across external API fetches.
- Fixed `WalkaroundController` to ignore modifier combos (`Alt`/`Ctrl`/`Meta`) in its key handler and restore the saved camera definition position on exit.
- Fixed `PushbackController.setMode` to guard against airborne, high-speed, paused, or crashed activation.
- Improved Chromium executable discovery in `tests/e2e/run-e2e.mjs`.

---

## [0.3.0] - 5-Category Architecture, Community Integrations & AP++

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**. Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

### Changed

- Organized the extension into **5 categories** (*Flight Control & Avionics*, *Flight Deck & Operations*, *Environment & Visuals*, *Immersion & Failures*, and *Utilities & QoL*) with Airliner IFR and VFR/Glider presets in the Popup and Full Settings.
- Split `RealismPackModule` into focused **Visuals & Lighting** (`visuals-lighting`, `LIGHTS` HUD tab), **Sim Utilities** (`sim-utilities`), and **Realism Pack** (`realism-pack`) modules, and grouped Realism/Visual/Utility toggles in Options and the Side Panel.
- Removed redundant HUD tabs (`FAILS`, `FPV`, `OP ENG`) where dedicated pills, widgets, or top-bar controls already exist.
- Integrated **AP++** (`autopilot-pp`) with ICAO Direct/Parallel/Teardrop holds + WCA, Rotorcraft Auto-Hover & SAS, and exponential Autoland flare.
- Added **1–5 Star Ratings**, **Authentic vs. Practice** flight session tracking, and phase-by-phase critique in `#statsCard`, `LAND` HUD tab, Options Logbook, and CSV/JSON exports.
- Added **Visuals & Lighting** (aircraft ground headlights, runway glow, opt-in OSM taxiway lights, Night VFR LiDAR, Wind & Thermals), **Generic GPWS + V-Speed Takeoff Callouts**, **METAR & MINI-MAP** in `INFO`, **Gate Spawner** (`GATES`), **FSX Slew Mode** (`Shift+Y`), and **Middle-Click Camera Reset**.

### Fixed

- Connected `AutopilotPlusModule` (`AP++`) directly to `window.geofs.autopilot.turnOn()` / `turnOff()` / `setCourse()` / `setAltitude()`, automatically yielding native autopilot whenever custom PID modes (`HOLD`, `VNAV`, `FLCH`, `HOVER`) are active, and routed Side Panel commands to the selected GeoFS tab.

---

## [0.2.1] - Unification Polish And Verification Fixes

### Added

- Unified project website (`website/`) with Vite/TypeScript landing page, GitHub Pages deployment workflow (`.github/workflows/pages.yml`), hub navigation link, and adaptive system, display, and accessibility detection (`prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`, HiDPI, and coarse-pointer support).
- Consolidated GeoFS V4.0 live verification status summary (`docs/live-v4-status.md`) and leg-by-leg verification reports (`docs/live-leg2-2026-11-19.md`, `docs/live-leg3-2026-11-19.md`, `docs/live-leg4-2026-11-19.md`).
- `OPSYNC_RELEASED` diagnostic emission in `AutothrottleModule` when releasing OP-SYNC on teardown.

### Changed

- Updated website and extension icon assets (`public/icons/`, `dist/icons/`, and `website/public/`) to the unified project design.
- Updated `FuelSimulatorModule` to prefer live `engine.currentThrust` over fixed rated thrust for idle/asymmetric fuel burn and synchronize live `rigidBody.setMassProps` with scaled inertia vectors (restoring original mass and inertia on teardown).
- Reworked `EffectiveSasController` to apply PID aerodynamic `controls.pitch` / `controls.roll` stabilization with angular-velocity damping instead of world-axis torque injection, ignore its own control outputs when raw pilot inputs are absent, and yield when native autopilot is active.
- Updated the Side Panel `Realism & Fuel` tab to show V4-unsupported realism options as disabled with `Unavailable on V4` badges instead of hiding them.

### Fixed

- Fixed `SimAdapter` `gearDown` detection to follow the GeoFS convention (`gearPosition < 0.5` indicates gear down).
- Fixed `ChecklistSystemModule` `lightsOn` hardware actuation to fall back to `toggleLights` and surface a warning toast when no light setter is available.
- Restored the missing `Realism & Fuel` tab container in `src/sidepanel/app.tsx` and refreshed the unpacked `dist/sidepanel` bundle.

---

## [0.2.0] - Unified Cockpit Architecture And Parity

### Added

- Coordinated **Chrome Side Panel** (`sidepanel/index.html`) and 4-tab **Full Settings Page** (`options/index.html`) alongside the compact Toolbar Popup, backed by separated `geofs_ext_config` and `geofs_script_config` sync storage.
- Titleless 4-tab Native GeoFS `#flightDataDisplay` (`INFO`, `CHECKS`, `FUEL`, `LAND`) with draggable SVG grip, `40×40` `HUD` circle minimize toggle, `24×40` left-edge handle, and dynamic window-stacking focus management.
- Configurable **OP-SYNC** confirmation policy (`ask`, `allow`, `never`) between Autothrottle and Overpowered Engines, plus closed-loop `EffectiveSasController` reading raw pilot stick inputs.
- Four mandatory flight-gate checklists (`PRE-T/O`, `PRE-CRZ`, `PRE-LDG`, `CHOCKS`) tailored across cataloged aircraft and rotorcraft with telemetry auto-checks and expandable situational reference guides.
- Standalone draggable `FAILURES` pill and `420px` `#geofs-failure-menu` modal with configurable probability rolls, automatic emergency QRH overrides, probabilistic recovery rolls, and unrecovered contingency fallback checklists.
- Classic GeoFS V3.9 Cesium 3D billboard `FPV` (`512×512` `fpv_hires.png` / `fpv_lowres.png`) with `#flightDataDisplay0` glideslope widget, slide-in `#statsCard`, serialized Chrome Logbook JSON/CSV replay exports, and Playwright Chromium real-browser E2E suite (`tests/e2e/run-e2e.mjs`).
- Live `[GeoFS-EXT][DIAG]` diagnostic events, Verification Bundle export, and the 5-leg [Live Verification Guide](docs/live-verification-guide.md).

### Changed

- Moved Realism Pack controls into background settings surfaces (Popup / Side Panel / Options) with explicit `UNAVAILABLE ON V4` badges for `vortexEffects` and `carrierOps` on GeoFS V4.0.
- Styled `LANDING` on `.ext-autothrottle-bar` in `'LCD-Bold', monospace` matching the digital speed readout, upgraded `.mdl-tooltip` elements cleanly, and renamed `DYN SFC` to `ALTITUDE BURN` across multi-engine throttles.

### Fixed

- Suppressed `.mdl-tooltip:not(.is-active)` layout expansion inside `.ext-autothrottle-bar` so the autopilot bar never collides with bottom-right controls.
- Separated `#opSASBtn` from `OP-SYNC` thrust lock overlays, suppressed accidental click triggers when dragging `#fail-btn` or HUD headers, and deferred startup toast emission until synced `ExtensionSettings` arrive.
- Pop-up appearance, Side Panel, and Options support Dark, Light, and Auto themes synced to storage.

## [0.1.0] - Initial Unified Manifest V3 Release

### Added
- **Unified V3 / V4 Runtime**: Automatic major-version detection (`GeoFS 3.x` and `4.x`, ignoring minor versions) via `SimAdapter`.
- **Dual-World MV3 Architecture**: `MAIN` world simulator integration paired with an `ISOLATED` world `chrome.storage` bridge.
- **Centralized TelemetryBus & ModuleManager**: Single `requestAnimationFrame` loop and strict `init` / `update` / `destroy` contracts for leak-free hot-toggling.
- **10 Modular Addons**: Autothrottle (aircraft-class PID presets), Information Display (multi-engine `% THR` & `[REV]`), Fuel Simulator, Overpowered Engines, Type-Aware Checklist System, Realism Pack (adaptive GLSL 3.00 ES / 1.00 shaders), Failure Simulator, SVG Flight Path Vector, Landing Statistics + Logbook, and Configurable Satellite Imagery.
- **Preact + TypeScript Popup UI**: Module toggles & presets, Day/Night dynamic theming synced to GeoFS time, Screen Calibrator (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), OS-aware keybindings, and persistent landing logbook.
- **Extension Icons & Packaging**: Bundled `16x16`, `48x48`, and `128x128` PNG icons and zip release packaging.
