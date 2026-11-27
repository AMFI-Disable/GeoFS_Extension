<div align="center">

# GeoFS Flight Suite (`GeoFS_Extension`)

[中文文档](readme.zh-cn.md) · [Contributing](contributing.md)

**All-In-One Addon Pack For GeoFS V3.9 & V4.0 — AP++ Autopilot, Autothrottle, Landing Stats, SimBrief, GPWS, Realism Pack, Fuel, Failures, TCAS & Pushback**

[![Website: Live](https://img.shields.io/badge/Website-Live-66BB6A.svg?style=flat-square)](https://amfi-disable.github.io/GeoFS_Extension/)
![Version](https://img.shields.io/badge/Version-v0.3.0-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-GeoFS%20V3%20%26%20V4-informational?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Roadmap](docs/roadmap.md) · [To-Do](docs/todo.md) · [Changelog](changelog.md) · [Legacy Userscripts](userscripts/readme.md) · [Security Policy](security.md) · [MIT License](license)

</div>

---

## Star History

<a href="https://www.star-history.com/?type=date&repos=amfi-disable%2Fgeofs_extension">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=amfi-disable%2Fgeofs_extension&type=date&theme=dark&legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=amfi-disable%2Fgeofs_extension&type=date&legend=top-left" />
    <img alt="AMFI-Disable/GeoFS_Extension Star History Chart" src="https://api.star-history.com/chart?repos=amfi-disable%2Fgeofs_extension&type=date&legend=top-left" />
  </picture>
</a>

---

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: `GeoFS_Extension` is an open-source, client-side flight instrumentation and realism enhancement suite intended strictly for educational and single-player simulation enjoyment. It does **not** bypass GeoFS subscriptions, ad-reward entitlements, multiplayer server rules, or platform access controls.

---

## Key Highlights

**GeoFS Extension** combines all standalone GeoFS flight addons into a single lightweight Chrome extension designed to feel right at home inside both **GeoFS V3.9** (`www.geo-fs.com`) and **GeoFS V4.0** (`beta.geo-fs.com`).

- **One Install, Zero Script Conflicts**: Replace a dozen separate userscripts with one coordinated package managed from your browser toolbar across **5 categories** (*Flight Control & Avionics*, *Flight Deck & Operations*, *Environment & Visuals*, *Immersion & Failures*, and *Utilities & QoL*).
- **Built-In Cockpit Style**: Matches GeoFS's native dark glass HUD panels and autopilot bar buttons with Day/Night automatic theming.
- **Fly Any Aircraft**: Includes aircraft-aware speed profiles, fuel weights, and step-by-step checklists for light props, airliners, fighters, supersonic jets, and helicopters.
- **Turn Features On Or Off Live**: Enable only the addons you want during a flight without reloading your browser.

---

## How To Install

1. Download the latest release from [GitHub Releases](https://github.com/AMFI-Disable/GeoFS_Extension/releases) and unzip the folder somewhere easy to find on your computer *(or build `dist/` from source — see [Building From Source](#building-from-source))*.
2. Open Chrome, Edge, or Brave and go to `chrome://extensions`.
3. Turn on **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the extracted extension folder (containing `manifest.json`).
5. Pin **GeoFS Extension** to your browser toolbar, then open or refresh [GeoFS V3.9](https://www.geo-fs.com/geofs.php) or [GeoFS V4.0](https://beta.geo-fs.com/geofs.php).

> [!TIP]
> If you previously installed individual GeoFS scripts in Tampermonkey or Violentmonkey, disable or pause those userscripts before flying with the Chrome extension so two HUDs do not overlap.

---

## Quick Flight Tour

Once loaded into GeoFS, you control the suite from four clean places:

1. **In-Game Floating HUD (Top Right)**: Holds four core tabs — **INFO** (with collapsible **METAR** & **MINI-MAP** radar), **CHECKS**, **FUEL**, and **LAND** — plus on-demand tabs (**REALISM**, **LIGHTS**, **GATES**, **AP++**) via the `+` menu. Drag it anywhere on screen, click `−` to shrink it into a movable circular **HUD** button, or drag it to the left edge to dock it.
2. **Autopilot Bar Addons (Bottom Bar)**: Adds **A/THR** (Autothrottle + **LANDING** arm button), **AP++** (unified VNAV/Holds/Autoland/Hover), and **OP ENG** (Overpowered Engines + **SAS** stability hold) alongside your plane's built-in Autopilot buttons.
3. **Toolbar Popup & Chrome Side Panel**: Click the extension icon in your Chrome toolbar to toggle categorized modules on/off, apply presets (**All On**, **Airliner IFR**, **VFR / Glider**, **Minimal**, **All Off**), pick a **Screen Calibrator** size, or open the docked **Side Panel** for AP++ controls and grouped Realism/Visual toggles.
4. **Full Settings Page**: Open from the popup to customize script behavior, manage keyboard shortcuts, edit aircraft V-speeds and specs, or inspect and export your saved **Landing Logbook** (JSON / CSV).

---

## Features At A Glance

| Category | Feature | What It Does In Flight |
| :--- | :--- | :--- |
| **Flight Control** | **Autothrottle (`A/THR`)** | Holds target airspeed (`KTS`) or Mach (`M.`) with **LANDING** auto-retard (`27 ft RA`) and spoiler deployment. |
| **Flight Control** | **AP++** | Unified FCU with VNAV/FLCH, LNAV route arc backup, Mach crossover, ICAO Direct/Parallel/Teardrop holds with WCA, LAT/LON steering, Autoland flare, Rotorcraft Auto-Hover, and Envelope Protection. |
| **Flight Control** | **Overpowered Engines (`OP ENG`)** | Multiplies thrust (`1x`–`1,000,000,000x`), bypasses altitude ceilings, and includes closed-loop **SAS** + **OP-SYNC**. |
| **Flight Control** | **Flight Path Vector (`FPV`)** | Projects a 3D velocity marker ahead of your aircraft paired with a bottom-right **Glideslope** indicator. |
| **Flight Deck** | **Information Display (`INFO`)** | Live telemetry, multi-engine `% THR` / `[REV]`, nearest-airport **METAR**, and SVG runway/heading **MINI-MAP** with TCAS traffic. |
| **Flight Deck** | **Live Radar & EFB (Side Panel)** | Free live GeoFS + global **ADS-B** radar with popout tab and callsign watchlist, plus an **EFB** with **SimBrief OFP** import, FAA airport charts, crosswind calculator, and Career Jobs. |
| **Flight Deck** | **Checklists & Guide (`CHECKS`)** | Four mandatory flight gates (**PRE-T/O**, **PRE-CRZ**, **PRE-LDG**, **CHOCKS**) with interactive controls and situational **GUIDE**. |
| **Flight Deck** | **Fuel & Weight (`FUEL`)** | Fuel slider, **ALTITUDE BURN**, **REAL TANKS** wing imbalance, and flameout protection. |
| **Flight Deck** | **Landing Scorecard (`LAND`)** | Evaluates every landing (`Butter`–`Crash`) with **1–5 Star Ratings**, **Authentic vs. Practice** session tracking, phase-by-phase critique, and Chrome Logbook CSV/JSON export. |
| **Environment** | **Visuals & Lighting (`LIGHTS`)** | Ground headlights/nav/strobe/beacon shaders, runway light glow, opt-in OSM taxiway lights (with automatic **Immersive Airports** detection), opt-in **Night VFR LiDAR**, and **Wind & Thermals** glider visualizer. |
| **Environment** | **Satellite Imagery** | Switch GeoFS ground imagery between Native, Esri, Bing, OpenStreetMap, or custom tile providers. |
| **Immersion** | **Realism Pack (`REALISM`)** | G-force breathing, cockpit blackout, shake, engine inertia, spoiler arming, 737/777/A320 SFX, and **Generic GPWS + V-Speed Takeoff Callouts**. |
| **Immersion** | **Failure Simulator (`FAILURES`)** | Draggable `FAILURES` pill & modal for system faults, random probabilities, and Emergency QRH recovery. |
| **Utilities** | **Gate Spawner (`GATES`)** | Search airports by ICAO, filter stands by aircraft size (`Heavy`, `Code F`, `GA`, `Cargo`), and spawn parked at the gate. |
| **Utilities** | **Sim Utilities** | FSX-style **Slew Mode** (`Alt + Y`), **Pushback Tug**, **Pre-Flight Walkaround** (`Alt + W`), **Shortcut Overlay** (`?`), and **Middle-Click Camera Reset** (double-click middle mouse button). |

---

## Keyboard Shortcuts

| Action | Default Shortcut (Windows / Linux) | Default Shortcut (macOS) |
| :--- | :--- | :--- |
| Toggle Autothrottle | `Alt + A` | `⌥ + A` |
| Toggle Overpowered Engines Card | `Alt + O` | `⌥ + O` |
| Toggle Shared HUD | `Alt + H` | `⌥ + H` |
| Toggle Flight Path Vector | `Alt + F` | `⌥ + F` |
| Open Checklists Tab / Advance Gate | `Alt + C` | `⌥ + C` |
| Toggle Landing & Taxi Lights | `Alt + L` | `⌥ + L` |
| Toggle FSX Slew Mode | `Alt + Y` | `⌥ + Y` |
| Toggle Pre-Flight Walkaround | `Alt + W` | `⌥ + W` |
| Open Shortcut Cheatsheet | `?` (`Shift + /`) | `?` (`⇧ + /`) |
| Reset Camera | Double-click Middle Mouse | Double-click Middle Mouse |

All shortcuts can be rebound in **Full Settings**, which automatically warns you if a shortcut conflicts with GeoFS's built-in flight keys. Shortcuts never fire while you are typing inside text inputs.

---

## Legacy Userscripts

If you prefer installing single standalone `.user.js` scripts with Tampermonkey instead of the unified Chrome extension, archived copies for both simulator generations are kept in [`userscripts/`](userscripts/readme.md):

- **GeoFS V3.9 Scripts**: [`userscripts/v3.9/`](userscripts/v3.9/readme.md) · [Changelog](changelog.md)
- **GeoFS V4.0 Scripts**: [`userscripts/v4.0/`](userscripts/v4.0/readme.md) · [Changelog](changelog.md)

---

## Repository Structure

| Folder | Contents |
| :--- | :--- |
| [`docs/`](docs/live-verification-guide.md) | [Roadmap & Awaiting Planes](docs/roadmap.md), [Parity & Post-Verification To-Do](docs/todo.md), [Live Verification Guide](docs/live-verification-guide.md), and [Agent Guide](docs/agents.md). |
| [`userscripts/`](userscripts/readme.md) | Archived standalone `.user.js` scripts organized into [`v3.9`](userscripts/v3.9/readme.md) and [`v4.0`](userscripts/v4.0/readme.md) (with individual scripts under `modules/`). |
| `src/` | Unified TypeScript & Preact source code for the Chrome Extension (`core/`, `modules/`, `popup/`, `sidepanel/`, `options/`, `background/`, `content/`). |
| `public/` | Extension manifest, icons, cockpit audio files, and `FPV` visual assets. |
| `tests/` | Automated unit, contract, and Playwright Chromium verification suites. |
| `scripts/` | Build and release packaging script (`build.mjs`). |

---

## Tips And Troubleshooting

- **HUD looks too large or too small**: Open the toolbar popup and select your monitor under **Screen Calibrator** (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`).
- **Missing controls after updating**: Click **Reload** on the GeoFS Extension card in `chrome://extensions`, then refresh your GeoFS browser tab.
- **Duplicate panels or overlapping buttons**: Make sure old standalone userscripts are turned off in Tampermonkey when running the extension.
- **Where are my landing logs stored?**: Everything stays locally inside your browser's Chrome extension storage. You can back up or download your flights anytime from **Full Settings -> Logbook & Verification**.

---

## Building From Source

Developers and testers can build and verify the extension locally with Node.js:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Load the generated `dist/` folder via `chrome://extensions` (**Load unpacked**) and follow the [Live Verification Guide](docs/live-verification-guide.md) when testing live flights. To generate a release ZIP in `release/`, run `npm run package`.
