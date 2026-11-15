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

[MIT](license) · © 2026 AMFI-Disable
