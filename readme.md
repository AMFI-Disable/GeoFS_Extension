# GeoFS_Extension

Unified **Manifest V3** Chrome Extension for **GeoFS V3.x and V4.x** (ignoring minor versions).

## Features
- **Unified V3 / V4 SimAdapter**: Automatically detects GeoFS major version (`3` or `4`) and normalizes controls, aircraft classification, and day/night lighting.
- **Centralized TelemetryBus**: Single `requestAnimationFrame` loop powering all active modules with zero global scope pollution.
- **Modular Addon Suite**: Autothrottle (aircraft-class PIDs), Information Display (multi-engine `% THR` / `[REV]`), Fuel Simulator, Overpowered Engines, Type-Aware Checklist System, Realism Pack (adaptive GLSL 3.00 ES / 1.00 shaders), Failure Simulator, SVG Flight Path Vector, Landing Statistics + Logbook, and Configurable Satellite Imagery.
- **Preact + TypeScript Popup**: Toggle modules live, calibrate HUD scaling (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), customize OS-aware keybindings, and review landing history.

## Development & Build

```bash
npm install
npm run typecheck
npm test
npm run build
```

Load the generated `dist/` folder in Chrome via `chrome://extensions` → **Developer mode** → **Load unpacked**.

---

## Legacy Userscripts (While Extension Is In Development)

All standalone Tampermonkey/Violentmonkey userscripts from the archived V3.9 and V4.0 repositories are preserved here so you can continue using them until the Chrome Extension reaches full feature parity.

### GeoFS V4.0 Userscripts (`legacy-scripts/v4.0/`)
- **All-in-One Bundle**: [addon-pack_standalone.user.js](legacy-scripts/v4.0/addon-pack_standalone.user.js)
- **Foundations**: [core-library_standalone.user.js](legacy-scripts/v4.0/core-library_standalone.user.js) · [design-system_standalone.user.js](legacy-scripts/v4.0/design-system_standalone.user.js)
- **Flight & HUD Modules**:
  - [autothrottle_standalone.user.js](legacy-scripts/v4.0/autothrottle_standalone.user.js)
  - [checklist-system_standalone.user.js](legacy-scripts/v4.0/checklist-system_standalone.user.js)
  - [failure-simulator_standalone.user.js](legacy-scripts/v4.0/failure-simulator_standalone.user.js)
  - [flight-path-vector_standalone.user.js](legacy-scripts/v4.0/flight-path-vector_standalone.user.js)
  - [fuel-simulator_standalone.user.js](legacy-scripts/v4.0/fuel-simulator_standalone.user.js)
  - [information-display_standalone.user.js](legacy-scripts/v4.0/information-display_standalone.user.js)
  - [landing-statistics_standalone.user.js](legacy-scripts/v4.0/landing-statistics_standalone.user.js)
  - [overpowered-engines_standalone.user.js](legacy-scripts/v4.0/overpowered-engines_standalone.user.js)
  - [realism-pack_standalone.user.js](legacy-scripts/v4.0/realism-pack_standalone.user.js)

### GeoFS V3.9 Userscripts (`legacy-scripts/v3.9/`)
- **All-in-One Bundle**: [addon-pack_standalone.user.js](legacy-scripts/v3.9/addon-pack_standalone.user.js)
- **Foundations**: [core-library_standalone.user.js](legacy-scripts/v3.9/core-library_standalone.user.js) · [design-system_standalone.user.js](legacy-scripts/v3.9/design-system_standalone.user.js)
- **Flight & HUD Modules**:
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

---

[MIT](license) · © 2026 AMFI-Disable
