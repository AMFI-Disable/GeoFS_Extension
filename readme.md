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

- **Unified V3 And V4 SimAdapter**: Automatically detects GeoFS major version (`3` or `4`, ignoring minor updates) and normalizes throttle channels, flaps, gear, aircraft classification, and day/night lighting.
- **Dual-World Manifest V3 Bridge**: Executes simulator hooks in the `MAIN` world (`src/content/main.ts`) while isolating `chrome.storage` persistence in the `ISOLATED` world (`src/content/bridge.ts`).
- **Centralized TelemetryBus**: Single `requestAnimationFrame` loop powering all active modules with zero global scope pollution and leak-free hot-toggling.
- **Modular Addon Suite**: Includes Autothrottle (GeoFS PID with KIAS and Mach modes), Information Display (multi-engine `% THR` / `[REV]`), Fuel Simulator, Overpowered Engines, Type-Aware Checklist System, Realism Pack (adaptive GLSL 3.00 ES / 1.00 shaders), Failure Simulator, SVG Flight Path Vector, Landing Statistics + Logbook, and Configurable Satellite Imagery.
- **Preact And TypeScript Popup**: Toggle modules live, calibrate HUD scaling (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), customize OS-aware keybindings, and review your persistent landing logbook.
- **Aircraft Profiles And V-Speeds**: Setup lets you save overrides for the active aircraft. INFO and CHK show reference speeds supplied by the simulator or entered in Setup. Rotorcraft have their own checklists, collective display, and torque display when the aircraft supplies torque.
- **Landing Replay Export**: Logbook entries can export up to 30 seconds of approach and touchdown telemetry as JSON or CSV. Older entries export their touchdown summary.
- **Popup Appearance**: In Setup, choose Light, Dark, or Auto (System). The panel inside GeoFS follows the simulator’s local time.

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
npm ci
npm run typecheck
npm test
npm run build:unpacked
```

1. Open `chrome://extensions` in Chromium/Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the generated sibling `GeoFS Extension` folder.
4. Reload any open GeoFS tab to activate the addons.
5. For packaged releases, see [GitHub Releases](https://github.com/AMFI-Disable/GeoFS_Extension/releases).

For each commit you want to test, run `npm run build:unpacked` from the checkout and click **Reload** on the extension card. The command also creates the standard `dist/` output.

---

## Legacy Userscripts

The GeoFS Extension monorepo contains the Manifest V3 Chrome extension and the archived userscripts for both simulator generations.

- [GeoFS V3.9 Userscripts](geofs-v3.9/readme.md) · [Changelog](geofs-v3.9/changelog.md)
- [GeoFS V4.0 Userscripts](geofs-v4.0/readme.md) · [Changelog](geofs-v4.0/changelog.md)
