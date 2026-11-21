# Verified Community GeoFS Resources (V4.0 & Inactive Archive)

This catalog documents community GeoFS repositories verified against the GitHub API on 2026-11-20, their licensing status, and their target category in `GeoFS_Extension`.

## Phase 1: Realism Pack — Lighting (Implemented)

| Resource | License | Status | Integration |
| :--- | :--- | :--- | :--- |
| [frietjesbeer/GeoFS-headlights](https://github.com/frietjesbeer/GeoFS-headlights) | MIT | Active (V4.0) | Ported into `aircraft-lights.ts` & `light-shader.ts` |
| [Ariakim-Taiyo/GeoFS-Experiments](https://github.com/Ariakim-Taiyo/GeoFS-Experiments) (`lightsShader.js`) | None | Experimental | Clean-room `runway-glow.ts` using `geofs.fx.litRunways` |
| [Mahe40Landes/geofs-exterior-lights](https://github.com/Mahe40Landes/geofs-exterior-lights) | None | Experimental | Presets (`Cold & Dark`, `Takeoff`) & logo light concept |
| [tylerbmusic/GeoFS-Taxiway-Lights](https://github.com/tylerbmusic/GeoFS-Taxiway-Lights) | None | Inactive | Clean-room opt-in `taxiway-lights.ts` (Overpass, zero telemetry) |

## Phase 2 Candidates

| Category | Resource | License | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Realism Pack Audio | [tylerbmusic/GeoFS-GPWS-Callouts](https://github.com/tylerbmusic/GeoFS-GPWS-Callouts) | None | Inactive | Clean-room generic GPWS callouts for all aircraft |
| Realism Pack Audio | [avramovic/GeoFS-alerts](https://github.com/avramovic/GeoFS-alerts) | None | Inactive | Behavior reference for stall/bank/TCAS alerts |
| Realism Pack Audio | [fengshuo2004/geofs-alarms](https://github.com/fengshuo2004/geofs-alarms) | GPL-3.0 | Inactive | Behavior reference only |
| Realism Pack VFR | [AviATR72/GeoFS-LiDAR-for-Night-VFR](https://github.com/AviATR72/GeoFS-LiDAR-for-Night-VFR) | None | Implemented (opt-in) | Clean-room `lidar/lidar.ts` night VFR terrain dot projection |
| Realism Pack Glider | [Tokke1111ALT/GeoFS-Wind-Terrain-and-Thermals-Addon](https://github.com/Tokke1111ALT/GeoFS-Wind-Terrain-and-Thermals-Addon) | MIT | Implemented (opt-in) | Ported into `wind-thermals.ts` |
| AP++ Roadmap | [Qantas94Heavy/autopilot-pp](https://github.com/Qantas94Heavy/autopilot-pp) | GPL-3.0 | Inactive | Behavior reference (PID modes, PAPI fixes) |
| AP++ Roadmap | [GeoFS-Extensions/autoland](https://github.com/GeoFS-Extensions/autoland) | GPL-3.0 | Archived | Behavior reference only |
| AP++ Roadmap | [tylerbmusic/GeoFS-Autoland](https://github.com/tylerbmusic/GeoFS-Autoland) | None | Inactive | Clean-room smooth autoland flare |
| AP++ Roadmap | [nafeesnazzim/geofs-holding-pattern](https://github.com/nafeesnazzim/geofs-holding-pattern) | MIT | Active | Port ICAO racetrack holds |
| AP++ Roadmap | [gefs-plugins/fmc-requirejs](https://github.com/gefs-plugins/fmc-requirejs) | AGPL-3.0 | Inactive | Behavior reference (VNAV) |
| Info Display | [tylerbmusic/GeoFS-Minimap](https://github.com/tylerbmusic/GeoFS-Minimap) | None | Implemented | Clean-room minimap HUD sub-tab |
| Info Display | [seabus0316/GeoFS-METAR-system](https://github.com/seabus0316/GeoFS-METAR-system) | None | Implemented | Clean-room nearest-airport METAR readout |
| Utilities | [machpoint82/geofs-gate-spawner](https://github.com/machpoint82/geofs-gate-spawner) | MIT | Implemented | Ported into `src/modules/gate-spawner/index.ts` |
| Utilities | [tylerbmusic/GeoFS-Slew-Mode](https://github.com/tylerbmusic/GeoFS-Slew-Mode) | None | Implemented (opt-in) | Clean-room `slew-mode.ts` (`Shift+Y`) |
| Realism Pack Audio | [GeoFS V-Speed Takeoff Callouts](https://greasyfork.org/en/scripts/by-site/geo-fs.com) (Greasy Fork) | — | Implemented | Clean-room `V1`/`ROTATE`/`V2` callouts in `generic-gpws.ts` |
| Rotorcraft AP++ | [GeoFS Eurocopter EC-135 AFCS Suite](https://greasyfork.org/en/scripts/by-site/geo-fs.com) (Greasy Fork) | — | Active | Future rotorcraft SAS/Auto-Hover reference |
| Camera QoL | [krunchiekrunch/GeoFS-Camera-Reset](https://github.com/krunchiekrunch/GeoFS-Camera-Reset) | CC BY-NC-SA | Implemented | Clean-room `camera-reset.ts` middle-click reset |

## Excluded Resources

- **Imagery / Ad Bypasses**: `GeoFS-HD-Free`, `GeoFS-free-HDfixed-with-ADs`, `GEOFS-HD`, `Geofs-full-hd-with-Google-Maps-`, `GeoFS-Better-Resolution-Addon`, `GeoFS-Ad-Remover` (violate fair-play / entitlement rules).
- **Multiplayer / Account Tools**: Player Hider, Chat Fix/Cleaner, Callsign Manager, Friend List, `GeoFS-flightradar` (out of scope).
- **External Model / Livery Packs**: `GEOFS-LiverySelector`, `Geofs-Multiliveries`, `GeoFS-Extra-Vehicles`, `Geofs-Jetbridge`, `GeoFS-Extra-Maritime-Structures` (maintained standalone).
- **External Account Dependencies**: `GeoFS-AI-ATC` (requires Puter login).
