<div align="center">

# GeoFS Extension

**Unified Manifest V3 Chrome Extension For GeoFS V3.x And V4.x**

![Version](https://img.shields.io/badge/Version-v0.1.0-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-GeoFS%20V3%20%26%20V4-informational?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Roadmap](roadmap.md) · [Changelog](changelog.md) · [Security Policy](security.md) · [MIT License](license)

</div>

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: `GeoFS_Extension` is an open-source, client-side flight instrumentation and realism enhancement suite intended strictly for educational and single-player simulation enjoyment. It does **not** bypass GeoFS subscriptions, ad-reward entitlements, multiplayer server rules, or platform access controls.

---

## Key Features

- **Unified V3 And V4 SimAdapter**: Automatically detects GeoFS major version (`3` or `4`, ignoring minor updates) and normalizes throttle channels, flaps, gear, aircraft classification, and day/night lighting.
- **Dual-World Manifest V3 Bridge**: Executes simulator hooks in the `MAIN` world (`src/content/main.ts`) while isolating `chrome.storage` persistence in the `ISOLATED` world (`src/content/bridge.ts`).
- **Centralized TelemetryBus**: Single `requestAnimationFrame` loop powering all active modules with zero global scope pollution and leak-free hot-toggling.
- **Modular Addon Suite**: Includes Autothrottle (aircraft-class PID presets), Information Display (multi-engine `% THR` / `[REV]`), Fuel Simulator, Overpowered Engines, Type-Aware Checklist System, Realism Pack (adaptive GLSL 3.00 ES / 1.00 shaders), Failure Simulator, SVG Flight Path Vector, Landing Statistics + Logbook, and Configurable Satellite Imagery.
- **Preact And TypeScript Popup**: Toggle modules live, calibrate HUD scaling (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), customize OS-aware keybindings, and review your persistent landing logbook.

---

## Keyboard Hotkeys

| Action | Default Shortcut (Windows / Linux) | Default Shortcut (macOS) |
| :--- | :--- | :--- |
| Toggle Autothrottle | `Shift + A` | `Shift + A` |
| Toggle Flight Path Vector | `Shift + V` | `Shift + V` |
| Cycle Checklist Phase | `Shift + C` | `Shift + C` |
| Trigger Failure Drill | `Shift + F` | `Shift + F` |

*(All keybindings can be inspected and customized in the extension popup.)*

---

## Development And Build

```bash
npm install
npm run typecheck
npm test
npm run build
```

1. Open `chrome://extensions` in Chromium/Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the generated `dist/` folder.
4. For packaged releases, see [GitHub Releases](https://github.com/AMFI-Disable/GeoFS_Extension/releases).

---

## Legacy Userscripts

All standalone Tampermonkey/Violentmonkey userscripts from the archived V3.9 and V4.0 repositories are preserved under `legacy-scripts/` so you can continue using them while upcoming aircraft profiles and modules on the [Roadmap](roadmap.md) are implemented.

### GeoFS V4.0 Userscripts

- **All-In-One Bundle**: [addon-pack_standalone.user.js](legacy-scripts/v4.0/addon-pack_standalone.user.js)
- **Foundations**: [core-library_standalone.user.js](legacy-scripts/v4.0/core-library_standalone.user.js) · [design-system_standalone.user.js](legacy-scripts/v4.0/design-system_standalone.user.js)
- **Flight And HUD Modules**:
  - [autothrottle_standalone.user.js](legacy-scripts/v4.0/autothrottle_standalone.user.js)
  - [checklist-system_standalone.user.js](legacy-scripts/v4.0/checklist-system_standalone.user.js)
  - [failure-simulator_standalone.user.js](legacy-scripts/v4.0/failure-simulator_standalone.user.js)
  - [flight-path-vector_standalone.user.js](legacy-scripts/v4.0/flight-path-vector_standalone.user.js)
  - [fuel-simulator_standalone.user.js](legacy-scripts/v4.0/fuel-simulator_standalone.user.js)
  - [information-display_standalone.user.js](legacy-scripts/v4.0/information-display_standalone.user.js)
  - [landing-statistics_standalone.user.js](legacy-scripts/v4.0/landing-statistics_standalone.user.js)
  - [overpowered-engines_standalone.user.js](legacy-scripts/v4.0/overpowered-engines_standalone.user.js)
  - [realism-pack_standalone.user.js](legacy-scripts/v4.0/realism-pack_standalone.user.js)

### GeoFS V3.9 Userscripts

- **All-In-One Bundle**: [addon-pack_standalone.user.js](legacy-scripts/v3.9/addon-pack_standalone.user.js)
- **Foundations**: [core-library_standalone.user.js](legacy-scripts/v3.9/core-library_standalone.user.js) · [design-system_standalone.user.js](legacy-scripts/v3.9/design-system_standalone.user.js)
- **Flight And HUD Modules**:
  - [autothrottle_standalone.user.js](legacy-scripts/v3.9/autothrottle_standalone.user.js)
  - [checklist-system_standalone.user.js](legacy-scripts/v3.9/checklist-system_standalone.user.js)
  - [failure-simulator_standalone.user.js](legacy-scripts/v3.9/failure-simulator_standalone.user.js)
  - [flight-path-vector_standalone.user.js](legacy-scripts/v3.9/flight-path-vector_standalone.user.js)
  - [fuel-simulator_standalone.user.js](legacy-scripts/v3.9/fuel-simulator_standalone.user.js)
  - [information-display_standalone.user.js](legacy-scripts/v3.9/information-display_standalone.user.js)
  - [landing-statistics_standalone.user.js](legacy-scripts/v3.9/landing-statistics_standalone.user.js)
  - [overpowered-engines_standalone.user.js](legacy-scripts/v3.9/overpowered-engines_standalone.user.js)
  - [realism-pack_standalone.user.js](legacy-scripts/v3.9/realism-pack_standalone.user.js)
  - [satellite-imagery_standalone.user.js](legacy-scripts/v3.9/satellite-imagery_standalone.user.js)
