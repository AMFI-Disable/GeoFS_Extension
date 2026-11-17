<div align="center">

# GeoFS Extension

**Manifest V3 Chrome Extension And Legacy Userscripts For GeoFS V3.x And V4.x**

![Version](https://img.shields.io/badge/Version-v0.2.0-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-GeoFS%20V3%20%26%20V4-informational?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Roadmap](roadmap.md) · [Changelog](changelog.md) · [Security Policy](security.md) · [MIT License](license)

</div>

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: `GeoFS_Extension` is an open-source, client-side flight instrumentation and realism enhancement suite intended strictly for educational and single-player simulation enjoyment. It does **not** bypass GeoFS subscriptions, ad-reward entitlements, multiplayer server rules, or platform access controls.

---

## Key Features

- **Unified V3 And V4 SimAdapter**: Automatically detects GeoFS major version (`3` or `4`, ignoring minor updates) and normalizes multi-channel throttles, flaps, gear, spoilers, rotorcraft collective/torque, V-speeds, and `AIRCRAFT_CATALOG` profiles.
- **Separated Storage And Multi-Surface Chrome UI**: Splits extension configuration (`geofs_ext_config`) from in-sim behavior (`geofs_script_config`) across three coordinated MV3 surfaces: a compact **Toolbar Popup**, a docked **Chrome Side Panel** (`[GeoFS-EXT][DIAG]` stream + Realism Pack switches with V4 `UNAVAILABLE` guards), and a 4-tab **Full Settings Page** in a new tab.
- **Titleless Four-Tab Shared HUD (`#flightDataDisplay`)**: Uses Native GeoFS dark glass styling (`rgba(0, 0, 0, 0.8)`, `1px solid #888`, `15px` radius, zero blur), hosting `INFO`, `CHECKS`, `FUEL`, and `LAND` with a `40×40` `HUD` circle minimize toggle and a `24×40` left-edge handle.
- **Autothrottle, Overpowered Engines, And Effective SAS**: Combines GeoFS PID speed hold (`'LCD-Bold'` `LANDING` label and upgraded `.mdl-tooltip` hints), configurable **OP-SYNC** high-delta confirmation (`Ask`, `Allow`, `Never`), Native-styled `#opEngineCard`, and closed-loop `EffectiveSasController` attitude hold and rate damping.
- **Four-Gate Aircraft Checklists And Failure QRH Overrides**: Provides `PRE-T/O`, `PRE-CRZ`, `PRE-LDG`, and `CHOCKS` tailored per aircraft with hardware actuation and live telemetry auto-checks, expandable situational reference guides, plus standalone `#geofs-failure-menu` fault injection, emergency QRH overrides, and recovery/contingency branching.
- **Fuel Weight Physics, Realism SFX, 3D FPV, And Logbook**: Supports multi-throttle `ALTITUDE BURN` (`1.35x` reverse scaling), `REAL TANKS` center/wing imbalance and `rigidBody.setMassProps` mass updates, background V3/V4 shaders and 737/777/A320 immersion audio, bundled `512×512` `fpv_hires.png` Cesium 3D billboard + `#flightDataDisplay0` glideslope box, slide-in `#statsCard`, and serialized JSON/CSV replay exports.

---

## Keyboard Hotkeys

| Action | Default Shortcut (Windows / Linux) | Default Shortcut (macOS) |
| :--- | :--- | :--- |
| Toggle Autothrottle | `Shift + A` | `Shift + A` |
| Toggle Overpowered Engines Card | `Shift + O` | `Shift + O` |
| Toggle Shared HUD | `Shift + H` | `Shift + H` |
| Toggle Flight Path Vector | `Shift + F` | `Shift + F` |
| Open Checklists Tab / Advance Gate | `Shift + C` | `Shift + C` |

*(All keybindings can be inspected and customized in the Full Settings Page with GeoFS hotkey collision detection.)*

---

## Development And Build

```bash
npm ci
npm run typecheck
npm test
npm run build:unpacked
npm run test:e2e
```

1. Open `chrome://extensions` in Chromium or Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the generated `GeoFS Extension` folder inside the checkout (or run `npm run test:e2e` for automated Chromium verification).
4. Reload any open GeoFS V3.9 (`www.geo-fs.com`) or V4.0 (`beta.geo-fs.com`) tab and follow the [Live Verification Guide](docs/live-verification-guide.md).
5. For packaged releases, see [GitHub Releases](https://github.com/AMFI-Disable/GeoFS_Extension/releases).

Run `bash scripts/sync-unpacked.sh` from the checkout to fetch and fast-forward the current branch from its configured upstream, install the locked dependencies, and rebuild `dist/` and the unpacked folder. The script stops if tracked files have local edits or the branches have diverged. Click **Reload** on the extension card and refresh your GeoFS tabs after the build succeeds. To build the current checkout without syncing, run `npm run build:unpacked`.

---

## Legacy Userscripts

The GeoFS Extension monorepo contains the Manifest V3 Chrome extension and the archived userscripts for both simulator generations.

- [GeoFS V3.9 Userscripts](geofs-v3.9/readme.md) · [Changelog](geofs-v3.9/changelog.md)
- [GeoFS V4.0 Userscripts](geofs-v4.0/readme.md) · [Changelog](geofs-v4.0/changelog.md)
