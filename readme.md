<div align="center">

# GeoFS Extension

**All-In-One Flight Deck Companion For GeoFS V3.9 And V4.0**

[![Website: Live](https://img.shields.io/badge/Website-Live-66BB6A.svg?style=flat-square)](https://amfi-disable.github.io/GeoFS_Extension/)
![Version](https://img.shields.io/badge/Version-v0.2.0-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-GeoFS%20V3%20%26%20V4-informational?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Roadmap](docs/roadmap.md) · [To-Do](docs/todo.md) · [Changelog](changelog.md) · [Legacy Userscripts](userscripts/readme.md) · [Security Policy](security.md) · [MIT License](license)

</div>

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: `GeoFS_Extension` is an open-source, client-side flight instrumentation and realism enhancement suite intended strictly for educational and single-player simulation enjoyment. It does **not** bypass GeoFS subscriptions, ad-reward entitlements, multiplayer server rules, or platform access controls.

---

## Key Highlights

**GeoFS Extension** combines all standalone GeoFS flight addons into a single lightweight Chrome extension designed to feel right at home inside both **GeoFS V3.9** (`www.geo-fs.com`) and **GeoFS V4.0** (`beta.geo-fs.com`).

- **One Install, Zero Script Conflicts**: Replace a dozen separate userscripts with one coordinated package managed from your browser toolbar.
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

1. **In-Game Floating HUD (Top Right)**: Holds four compact tabs — **INFO**, **CHECKS**, **FUEL**, and **LAND** — with no clutter or scrollbars. Drag it anywhere on screen, click `−` to shrink it into a movable circular **HUD** button, or drag it to the left edge of the screen to dock it as a slim pull-out tab.
2. **Autopilot Bar Addons (Bottom Bar)**: Adds **A/THR** (Autothrottle + **LANDING** arm button) and **OP ENG** (Overpowered Engines + **SAS** stability hold) alongside your plane's built-in Autopilot buttons.
3. **Toolbar Popup & Chrome Side Panel**: Click the extension icon in your Chrome toolbar to toggle modules on/off, pick a **Screen Calibrator** size (`1080p`, `1440p`, `4K`, `Ultrawide`, `Laptop`), or open the docked **Side Panel** for live status logs and Realism Pack switches.
4. **Full Settings Page**: Open from the popup to customize script behavior, manage keyboard shortcuts, edit aircraft V-speeds and specs, or inspect and export your saved **Landing Logbook** (JSON / CSV).

---

## Features At A Glance

| Feature | What It Does In Flight |
| :--- | :--- |
| **Autothrottle (`A/THR`)** | Holds your target airspeed (`KTS`) or Mach (`M.`) using aircraft-tuned throttle response. Arm **LANDING** on approach to automatically cut thrust to idle by `27 ft` radar altitude and deploy spoilers on touchdown. |
| **Overpowered Engines (`OP ENG`)** | Multiplies thrust (`1x` up to `1,000,000,000x`), bypasses altitude ceilings, and includes active **SAS** stability assist to hold pitch and bank steady at extreme speeds. Includes configurable **OP-SYNC** prompts when A/THR requests large speed changes. |
| **Information Display (`INFO`)** | Shows live per-engine throttle percentages, `[REV]` reverse thrust cues, airspeed, altitude, vertical speed, and clean flight telemetry inside the shared HUD. |
| **Checklists & Guide (`CHECKS`)** | Guides you through four mandatory flight gates (**PRE-T/O**, **PRE-CRZ**, **PRE-LDG**, **CHOCKS**) tailored to your aircraft. Click interactive rows to operate gear, flaps, brakes, or lights; telemetry checks complete automatically; open **GUIDE** for situational reference steps. |
| **Fuel & Weight (`FUEL`)** | Adjust fuel percentage on the fly, monitor fuel flow and gross weight impact on takeoff and climb, enable **ALTITUDE BURN** for throttle- and altitude-realistic consumption, or use **REAL TANKS** for center/wing tank balance and flameout protection. |
| **Landing Scorecard (`LAND`)** | Evaluates every landing (`Butter`, `Silky`, `Great`, `Smooth`, `Firm`, `Hard`, `Bone Shaker`, or `Crash`), slides in a scorecard with sink rate, G-force, bounces, and touchdown zone feedback, and saves replays to your local Chrome Logbook. |
| **Flight Path Vector (`FPV`)** | Projects a 3D velocity marker ahead of your aircraft showing your true flight path, paired with a bottom-right **Glideslope** indicator for smooth visual approaches. |
| **Failure Simulator (`FAILURES`)** | Open from the bottom-right `FAILURES` pill to trigger realistic faults (landing gear, controls, engines, hydraulics, electrical, pitot-static, MCAS) or timed random probabilities. Active faults automatically switch your Checklist to an **Emergency QRH** procedure with recovery attempts. |
| **Realism Pack & Audio** | Adds G-force breathing, blackout/redout effects, cockpit wind and shake, engine inertia, spoiler arming, and airliner cockpit/GPWS/TCAS sound cues *(controlled in the Side Panel and Full Settings; unsupported V4 effects are clearly labeled)*. |
| **Satellite Map Imagery** | Switch GeoFS ground imagery between Native, Esri, Bing, OpenStreetMap, or a custom tile provider from Settings. |

---

## Keyboard Shortcuts

| Action | Default Shortcut (Windows / Linux) | Default Shortcut (macOS) |
| :--- | :--- | :--- |
| Toggle Autothrottle | `Shift + A` | `⇧ + A` |
| Toggle Overpowered Engines Card | `Shift + O` | `⇧ + O` |
| Toggle Shared HUD | `Shift + H` | `⇧ + H` |
| Toggle Flight Path Vector | `Shift + F` | `⇧ + F` |
| Open Checklists Tab / Advance Gate | `Shift + C` | `⇧ + C` |

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
