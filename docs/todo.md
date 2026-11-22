# GeoFS Extension Parity And Roadmap To-Do

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

## Aircraft Sound And Realism Parity

- [x] Recover the original 737 Immersion SFX source and audio assets. Located upstream `Ariakim-Taiyo/GeoFs-737-Immersion-SFX` and `kolos26/GeoFs-737-Immersion-SFX-for-Realism-Addon` (live `editmysite.com` audio + `737_autopilot_disconnect.mp3`), and ported 737 engine/cabin/flaps/reverse/overspeed/touchdown/GPWS/TCAS/AP-disconnect cues into [aircraft-sounds.ts](../src/modules/realism-pack/aircraft-sounds.ts).
- [x] Compare the 777 and Airbus ports with their original expansions. Completed remaining cues in [aircraft-sounds.ts](../src/modules/realism-pack/aircraft-sounds.ts), including Airbus PTU, windshear (`isWindWarn`), TCAS (`traffic`/`climb`/`descend`/`clear`), and `sounds[3]`/`sounds[4]` volume ratios.
- [x] Port the 777 ground effect, stall buffeting, tiller, spoiler vibration, wing flex, and gear tilt against the corresponding aircraft definitions. Implemented in [`RealismPackModule`](../src/modules/realism-pack/index.ts) with safe part validation and full `restoreAircraft()` cleanup.
- [x] Confirm which Realism Pack settings were functional in the original scripts. Functional behavior (`gBreath`, `blackout`, `windAudio`, `cameraShake`, `propwash`, `spinFix`, `bladeCollisions`, `engineInertia`, `spoilerArming`, `soundExpansion`, `performanceMode`) is retained cleanly in background execution (with `vortexEffects` and `carrierOps` clearly gated as unavailable on GeoFS V4.0), controlled via the Chrome Side Panel and New-Tab Options page.
- [x] Harvest and integrate Realism Pack **Lighting** ([`light-shader.ts`](../src/modules/realism-pack/lighting/light-shader.ts), [`aircraft-lights.ts`](../src/modules/realism-pack/lighting/aircraft-lights.ts), [`runway-glow.ts`](../src/modules/realism-pack/lighting/runway-glow.ts), and opt-in [`taxiway-lights.ts`](../src/modules/realism-pack/lighting/taxiway-lights.ts)) with Cold & Dark / Takeoff presets, `Shift+L` keybind, and verified catalog in [community-resources.md](community-resources.md).

## Unification Architecture And Controls Parity

- [x] Refactor shared `#flightDataDisplay` HUD to strictly follow Native GeoFS styling (`rgba(0, 0, 0, 0.8)`, `1px solid #888`, `15px` radius, zero `backdrop-filter`) with a titleless 4-tab bar (`INFO`, `CHECKS`, `FUEL`, `LAND`), `40×40` `HUD` circle minimize toggle, and `24×40` left-edge handle.
- [x] Match the `LANDING` indicator font on `.ext-autothrottle-bar` to `'LCD-Bold', monospace` and upgrade `.mdl-tooltip` elements cleanly via `componentHandler.upgradeElement` when present.
- [x] Implement A/THR ↔ Overpowered Engines OP-SYNC high-delta policy (`ask` / `allow` / `never`) with live non-blocking prompt actions and native GeoFS dark/green button styling in `#opEngineCard`.
- [x] Replace raw attitude feedback in SAS with closed-loop `EffectiveSasController` reading pilot control inputs (`controls.rawRoll/rawPitch/rawYaw` with deadzone attitude lock and speed-scaled angular damping).
- [x] Implement 4 mandatory flight-gate checklists (`PRE-T/O`, `PRE-CRZ`, `PRE-LDG`, `CHOCKS`) tailored across every supported aircraft category in GeoFS, plus live speed/altitude/throttle auto-checks and expandable situational reference guides.
- [x] Rename cryptic `DYN SFC` to `ALTITUDE BURN`, wire all multi-engine throttles and reverse thrust factors, and emit `FUEL_MASS_SYNC` diagnostics across mass alterations.
- [x] Extract Failure Simulator into the draggable `FAILURES` pill + `420px` `#geofs-failure-menu` modal with configurable probability intervals, automatic emergency QRH checklist overrides, probabilistic recovery rolls, and unrecovered contingency fallback checklists.
- [x] Restore the slide-in `#statsCard` touchdown card alongside the `LAND` HUD tab and serialized Chrome Logbook storage (`SerializedLogbookStore`).
- [x] Re-implement Flight Path Vector using GeoFS V3.9 Cesium 3D billboard architecture with bundled `512×512` `fpv_hires.png` artwork and `#flightDataDisplay0` bottom-right Glideslope widget.
- [x] Split Chrome settings storage into Extension Settings (`geofs_ext_config`) and Script Settings (`geofs_script_config`), powered by coordinated Toolbar Popup, Chrome Side Panel, and Full New-Tab Options surfaces.

## Live Simulator Verification

Track individual V4 checks and their live evidence in the [V4 verification checklist](live-v4-status.md#live-verification-checklist).

- [ ] Install the current unpacked build from `dist/` in Chrome and test both GeoFS V3.9 and V4.0 following the [Live Verification Guide](live-verification-guide.md). Test live toggling, aircraft changes, respawns, and repeated enable/disable cycles.
- [ ] Verify thrust, reverse, landing retard (`<= 27 ft RA`), OP-SYNC prompt decisions (`Allow Once`, `Keep Standard`, `Always Allow`, `Never Allow`), Effective SAS attitude hold/turning authority, and native autopilot interaction with Autothrottle and Overpowered Engines active together.
- [ ] Verify `ALTITUDE BURN` across multi-engine/asymmetric throttles, `REAL TANKS` wing imbalance torque, `10%` vs `100%` fuel MTOW feel via `setMassProps`, refueling, and flameout lock/recovery.
- [ ] Verify grouped failures, engine smoke cleanup, cockpit blackout, emergency QRH checklist overrides, `[ATTEMPT RECOVERY]` success & contingency fallback updates, and 100% clean `RESTORE_VERIFIED` resets while other modules are active.
- [ ] Fly normal, bounced, hard, and off-target approaches using the 3D Cesium `FPV` billboard and `#flightDataDisplay0` glideslope indicator; verify `#statsCard` slide-in animation, audio cues, calibrated vertical speed, and JSON/CSV replay exports.
- [x] Check the logbook for lost records when stable and beta tabs write concurrently. Serialized all logbook writes through [service-worker.ts](../src/background/service-worker.ts) (`SerializedLogbookStore`) with ID deduplication and unit tests.
- [ ] Verify the Realism Pack G-force shader (GLSL ES 1.00 / ES 3.00), G-force audio, rotorcraft effects, 737/777/A320 sound expansion cleanup, and V4 `UNAVAILABLE` UI indicators via the Chrome Side Panel.

## Post-Verification Roadmap

> [!IMPORTANT]
> The major upgrades below begin **only after** all unit tests, Playwright Chromium E2E suites, and the 5-leg pilot-in-command live flight verification checks pass cleanly.

### AP++ Unified Flight Management Script

- [x] Synthesize **Autothrottle**, **Overpowered Engines + Effective SAS**, and enhanced native GeoFS Autopilot into a unified **AP++** flight management system inside `.geofs-autopilot-bar` and the `AP++` HUD tab.
- [x] Provide seamless VNAV / Mach / overspeed envelope protection, ICAO direct/parallel/teardrop holds with wind correction, precision autoland flare, rotorcraft Auto-Hover, and unified mode annunciators across V3.x and V4.x aircraft.

### Browser-Style Modular HUD Tabs

- [x] Upgrade `#flightDataDisplay` into a browser-style modular tab workspace supporting `+` Open Tab, `×` Close Tab, drag-to-reorder tabs, and custom dock presets.
- [x] Allow any installed module (`Info`, `Checks`, `Fuel`, `Land`, `Realism`, `Failures`, `OP ENG`, `FPV`, `GATES`, `AP++`) to be opened, pinned, or detached as live HUD tabs directly inside GeoFS.

### Flightradar-Integrated Flight Tracking And Star Rating Evaluation

- [x] Integrate continuous takeoff-to-landing flight session tracking (`Authentic Flights` verified via departure-to-touchdown telemetry continuity vs `Practice Flights` from mid-air spawns or slew).
- [x] Implement a calibrated **1–5-Star Rating System** alongside structured **Phase-By-Phase Critique Comments** covering departure configuration, cruise discipline, approach stabilization, and touchdown execution in [`FlightSessionEvaluator`](../src/modules/landing-statistics/session-evaluator.ts).
- [x] Surface star ratings, Authentic/Practice badges, and phase critique notes in `#statsCard` and the `LAND` HUD tab.

## Parity Boundaries

- Preserve the archived userscripts in `userscripts/v3.9/` and `userscripts/v4.0/`. Keep all ports on the shared telemetry bus and ensure effects are cleanly reversible via live toggles.
- GeoFS V3 imagery parity covers providers and settings the user can legitimately access while preserving GeoFS entitlement checks and ad-reward controls.
- Keep landing records local inside Chrome extension storage without external third-party telemetry uploads.
