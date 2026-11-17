# GeoFS Extension Live Verification Guide

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: `GeoFS_Extension` is intended strictly for educational and single-player simulation use. Never attempt to bypass GeoFS subscriptions, ad-reward entitlements, or multiplayer access controls.

This guide documents the **5-Leg Agent-Guided Live Flight Verification Protocol** for verifying every unified module, physics loop, UI fit constraint, and cross-module interaction inside real GeoFS **V3.9** and **V4.0** sessions using the Chrome Side Panel diagnostic viewer (`[GeoFS-EXT][DIAG]`) and Full New-Tab Options verification export.

---

## Chrome UI Surfaces And Storage Architecture

The unified extension separates **Extension Configuration** (`geofs_ext_config`) from **In-Sim Script Parameters** (`geofs_script_config`) across three coordinated Manifest V3 UI surfaces:

1. **Toolbar Popup (`popup/index.html`)**: Compact `360px` quick toggle menu with live telemetry badge, master module switches, Screen Calibrator preset, and direct launchers for the **Chrome Side Panel** and **Full Settings Page**.
2. **Chrome Side Panel (`sidepanel/index.html`)**: Docked live cockpit companion alongside the GeoFS 3D canvas displaying live flight state, `OP-SYNC` / `SAS` / `Failure` status pills, all 13 Realism Pack switches (explicitly marking `Vortex Effects` and `Carrier Ops` as `UNAVAILABLE` on V4.0), and the live `[GeoFS-EXT][DIAG]` stream.
3. **Full Settings Page In New Tab (`options/index.html`)**: Four spacious workspace tabs (**Extension Settings**, **Script Parameters**, **Aircraft Catalog & Checklists**, and **Logbook & Verification**) with replay exports and downloadable Verification Bundles.

---

## Diagnostic Event Reference

During flight verification, both the browser DevTools Console and the Chrome Side Panel log structured `[GeoFS-EXT][DIAG]` events emitted by active modules:

| Diagnostic Code | Emitter Module | Expected Flight Meaning |
| :--- | :--- | :--- |
| `UI_BOOT` / `UI_MOUNT` | Runtime Bootstrap | Confirms major version (`3` or `4`), synced settings, and active module list mounted cleanly. |
| `OPSYNC_PROMPT` / `OPSYNC_DECISION` | Autothrottle | Fires when speed delta exceeds `opDeltaThresholdKts` under `ask` policy, recording `allow-once`, `keep-standard`, `always-allow`, or `never-allow`. |
| `OPSYNC_ENGAGED` / `OPSYNC_RELEASED` | Autothrottle | Confirms handoff to `OverpoweredEnginesModule` and restoration back to user defaults. |
| `SAS_ACTIVE` / `SAS_DISENGAGED` | Overpowered Engines | Confirms closed-loop attitude-hold SAS activation and clean angular velocity teardown. |
| `FUEL_MASS_SYNC` | Fuel Simulator | Confirms live `definition.mass` and `rigidBody.setMassProps` update across fuel burn or slider changes. |
| `FAILURE_TRIGGERED` | Failure Simulator | Confirms fault injection, audio alert, and dispatch of authentic emergency QRH procedure to `CHECKS`. |
| `RESTORE_VERIFIED` | Failure Simulator | Confirms clean post-recovery or manual `FIX` restoration of gear collision points, airfoils, instruments, or smoke emitters. |
| `RECOVERY_FAILED` | Failure Simulator | Confirms unsuccessful recovery probability roll triggered automatic switch to contingency solution checklist. |
| `REALISM_STATE` | Realism Pack | Confirms shader/SFX options and explicit `UNAVAILABLE` capability state for V4 `vortexEffects` / `carrierOps`. |
| `FPV_BILLBOARD_READY` | Flight Path Vector | Confirms Cesium 3D billboard creation with `fpv_hires.png` or `fpv_lowres.png` and `howFar` projection factor. |
| `LANDING_RECORDED` | Landing Statistics | Confirms calibrated V/S rating, bounce counter, touchdown zone evaluation, and serialized logbook save. |
| `IMAGERY_CHANGED` | Satellite Imagery | Confirms tile provider transition or safe restore to `native` imagery. |

---

## Five-Leg Live Verification Protocol

Complete the following five flight legs in **GeoFS V3.9** (`www.geo-fs.com`) and **GeoFS V4.0** (`beta.geo-fs.com`) with the **Chrome Side Panel** open beside the simulator window.

### Leg 1: Cold Check And Visual Inspection (Parked On Runway)

1. Confirm `#flightDataDisplay` opens in the top-right corner (`top: 70px; right: 20px; width: 250px`) with **no title text** and four cleanly fitting tabs on one row (`INFO`, `CHECKS`, `FUEL`, `LAND`).
2. Test minimizing (`−` -> `40×40` `HUD` circle) and dragging `#flightDataDisplay` to the left viewport edge (`<= 16px`) to verify the `24×40` `#hudMinimizeBtn` edge handle appears and restores the HUD cleanly.
3. Inspect `.geofs-autopilot-bar`: confirm the `A/THR` speed pad, `'LCD-Bold'` `LANDING` label, and native-styled `OP ENG` toggle fit without wrapping or overlap.
4. Check Side Panel diagnostics for `UI_MOUNT` and confirm `REALISM_STATE` marks `Vortex Effects` and `Carrier Ops` as `UNAVAILABLE ON V4` when testing GeoFS V4.0.

#### Leg 1 Handoff: Initial Live Results

Leg 1 did not pass on the first run. The v0.2.0 unpacked build was installed, but the Chrome session also showed controls and styling consistent with archived GeoFS userscripts. Treat these observations as leads until an extension-only run reproduces them.

| Check | Live Observation |
| :--- | :--- |
| V4 HUD layout | All four titleless tabs fit on one row. With the saved position temporarily bypassed, the HUD sat 70 px from the top and 20 px from the right but measured 230 px wide instead of 250 px. The header measured 432 px tall and had tooltip elements among its children. |
| V4 HUD interaction | The HUD collapsed to a 40 × 40 px circle. Dragging it to the left edge and minimizing exposed the 24 × 40 px handle, which restored the HUD. The original saved position was restored after the check. |
| V4 autopilot controls | `A/THR` was in the native bar, and the hidden `LANDING` label had `LCD-Bold` as its configured font. The expanded layout and the extension’s `OP ENG` button were not verified. The visible `OP ENGINES` label matched the archived script, and the extension module is off by default. |
| V4 diagnostics | The page recorded `UI_MOUNT` and a V4 `REALISM_STATE` event marking both features unavailable. The diagnostics view opened as a regular tab showed Offline and no events. The docked Chrome Side Panel was not verified. |
| V3.9 | The page reported V3.9 and displayed the older HUD. No extension mount event was observed, so the unpacked controls could not be verified. |

For the next run, pause the legacy GeoFS scripts, reload both simulator tabs, and verify each aircraft is stationary on the runway with the extension’s native Side Panel docked. Enable the extension’s Overpowered Engines module for the bar layout check without activating thrust. If the HUD discrepancy persists, inspect the winning rules on `#flightDataDisplay` and whether inactive MDL tooltips take up space in its header. If the panel remains offline while the page records mount events, verify that `src/content/bridge.ts` receives those events and responds to the panel’s requests for the active tab. Keep Leg 1 open until both simulator versions pass.

### Leg 2: Pre-Takeoff Checklist And Fuel Weight Verification

1. Open the `CHECKS` tab and step through `PRE-T/O` (`Pre-Takeoff`). Click interactive hardware rows (`⚡` Parking Brake, Flaps, Gear, Lights) to confirm real simulator actuation, and click `GUIDE` to inspect situational reference guides.
2. Open the `FUEL` tab and move the fuel slider from `100%` to `10%`, confirming `FUEL_MASS_SYNC` updates `Gross Weight` and `setMassProps`.
3. Conduct a short takeoff roll at `100%` fuel versus `10%` fuel to confirm heavier takeoff acceleration and pitch response, then enable `ALTITUDE BURN` and `REAL TANKS` briefly to verify multi-throttle burn readout and wing tank drain (`L/C/R`).

### Leg 3: Climb, Cruise Checklists, A/THR OP-SYNC Prompt And Effective SAS

1. Engage `A/THR` and set a large speed target delta (`>= 150 kts`) while `OP-SYNC Policy` is set to `Ask Every Session`. Confirm the non-blocking bottom-right toast prompt appears (`Allow Once`, `Keep Standard`, `Always Allow`, `Never Allow`) alongside `OPSYNC_PROMPT` in diagnostics.
2. Open `#opEngineCard` via `OP ENG`, engage `ACTIVATE THRUST` at `500x`–`1,000x` with `SAS` active (`SAS_ACTIVE`), and climb smoothly through cruise.
3. Release stick/keyboard controls cleanly to verify closed-loop `EffectiveSasController` holds current pitch and bank rock-solid without oscillation, then command a turn to confirm speed-compensated turn authority.
4. Switch to `PRE-CRZ` (`Pre-Cruise`) in `CHECKS` and confirm live `⏱` telemetry rows automatically check off as gear retracts, flaps reach `0`, and altitude/cruise speed targets are crossed.

### Leg 4: Failures, Emergency QRH Override And Verified Recovery

1. Click the bottom-right `FAILURES` pill to open `#geofs-failure-menu` and trigger test failures across categories (`MCAS`, `Engine 1`, `Left Main Gear`, `Electrical`, `Pitot-Static`).
2. Verify `FAILURE_TRIGGERED` immediately switches the `CHECKS` tab to the matching **Emergency QRH** checklist and turns the matching `#led-*` red.
3. Click `ATTEMPT RECOVERY`:
   - On a successful roll, confirm `RESTORE_VERIFIED` clears the failure and restores controls, instruments, smoke emitters, or gear height (`point[2]`) back to normal.
   - On a failed recovery roll (`RECOVERY_FAILED` or permanent `Structural` damage), confirm the Emergency Checklist updates in-place to the **Contingency Solution** procedure.
4. Click `CLEAR ALL FAILURES` and confirm every system LED returns green with zero lingering smoke particles or blacked-out gauges.

### Leg 5: Approach With High-Res 3D FPV, Touchdown ScoreCard And Chocks-On

1. Confirm the Cesium 3D billboard `FPV` marker (`FPV_BILLBOARD_READY`) renders crisply using `fpv_hires.png` alongside the bottom-right `#flightDataDisplay0` Glideslope widget.
2. Step through `PRE-LDG` (`Pre-Landing`) checks, arm `LANDING` on `.ext-autothrottle-bar`, and fly the approach to touchdown. Confirm auto-retard executes by `<= 27 ft RA` and spoilers deploy upon ground contact.
3. Verify `#statsCard` slides in smoothly from the left (`left: 20px; bottom: 60px`) showing the `64×64` score badge, 10 touchdown metrics, and feedback banner, while `LANDING_RECORDED` persists to the Chrome Logbook.
4. Taxi clear, complete `CHOCKS` (`Pre-Chocks-On`), export a Verification Bundle (`.json`) from the **Logbook & Verification** tab in Options, and verify zero uncaught console errors before starting Post-Verification Roadmap epics in [Todo](todo.md).
