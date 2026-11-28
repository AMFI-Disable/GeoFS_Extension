# GeoFS V4.0 Live Verification Status

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

Tracker updated November 28, 2026. Checked items have live evidence from the builds documented below.

## Live Verification Checklist

### Leg 1 — Cold Check

- [x] Observe the titleless 250 px HUD with INFO, CHECKS, FUEL, and LAND on one row.
- [x] Drag the expanded HUD and verify the 24 × 40 px left-edge handle restores it.
- [x] Confirm docked Side Panel telemetry, `UI_MOUNT`, and `REALISM_STATE`.
- [x] Confirm Realism & Fuel renders and marks Vortex Effects and Carrier Ops unavailable on V4.
- [x] Confirm OP / Diag exposes boost controls and diagnostics.
- [x] Confirm fresh default HUD placement with no saved position.
- [x] Measure the 40 × 40 px off-edge collapsed circle and confirm it restores in place.
- [ ] Verify the expanded A/THR speed pad, LANDING label, and OP ENG layout in an extension-only parked session.

### Leg 2 — Checklist And Fuel

- [x] Confirm the checklist gates and fuel controls render.
- [ ] Verify PRE-T/O parking brake, flaps, gear, and lights each actuate in the simulator.
- [x] Open GUIDE and verify the situational reference for the aircraft.
- [x] Change fuel from 100% to 10% and verify gross weight, `FUEL_MASS_SYNC`, and native rigid-body `setMassProps`.
- [ ] Compare matched 100% and 10% fuel takeoff rolls for acceleration and pitch response.
- [ ] Verify live multi-throttle ALTITUDE BURN and REAL TANKS left, center, and right tank drain.

### Leg 3 — Climb, OP-SYNC, And SAS

- [x] Observe the OP-SYNC permission prompt and thrust handoff and restoration in the original V4 run.
- [ ] Verify a sustained climb with SAS active.
- [ ] Release pilot input and verify sustained pitch and bank hold without oscillation.
- [ ] Command turns and verify speed-compensated turn authority.
- [ ] Verify PRE-CRZ recognizes actual gear retraction.
- [ ] Verify PRE-CRZ tracks flaps, altitude, and cruise-speed gates.
- [ ] Verify `OPSYNC_RELEASED` is emitted on in-flight release.

### Leg 4 — Failures And Recovery

- [x] Verify parked failure injection, matching Emergency QRH, recovery outcomes, and combined cleanup.
- [x] Verify permanent Structural damage immediately opens **CONTINGENCY SOLUTION: STRUCTURAL AIRFRAME DAMAGE**, disables recovery, and clears via Clear All.
- [ ] Repeat airborne injection for MCAS, Engine 1, Left Main Gear, Electrical, and Pitot-Static. Confirm `FAILURE_TRIGGERED`, the matching QRH, and the corresponding red LED.
- [ ] Verify successful airborne recovery emits `RESTORE_VERIFIED` and restores the affected systems.
- [ ] Verify airborne failed recovery updates the contingency procedure.
- [ ] Verify airborne Clear All clears system LEDs, smoke, and instrument blackout.

### Leg 5 — Approach And Landing

- [x] Observe the Glideslope widget in V4.
- [x] Download and parse a Verification Bundle JSON containing existing logbook data.
- [ ] Verify the rendered high-resolution Cesium 3D FPV marker on approach and `FPV_BILLBOARD_READY`.
- [ ] Complete PRE-LDG and verify LANDING auto-retard by 27 ft radio altitude.
- [ ] Verify spoilers deploy on ground contact.
- [ ] Verify the fresh touchdown opens `#statsCard` with the score badge, metrics, and feedback.
- [ ] Verify `LANDING_RECORDED` and confirm the new entry survives a reload in Chrome Logbook.
- [ ] Taxi clear and complete CHOCKS.
- [ ] Export a Verification Bundle containing the new landing and check the run for uncaught console errors.

## Reports

- [Initial Live Verification](live-verification-2026-11-18.md)
- [Leg 2 Checklist And Fuel](live-leg2-2026-11-19.md)
- [Leg 3 Climb, OP-SYNC And SAS](live-leg3-2026-11-19.md)
- [Leg 4 Failures And Recovery](live-leg4-2026-11-19.md)
- [Five-Leg Verification Guide](live-verification-guide.md)

## V4.0 Retest On Build 7bf1142

- **Leg 1** — With Tampermonkey paused and the simulator reloaded, the extension HUD and A/THR appeared. Enabling Overpowered Engines added the OP ENG toggle. The A380 remained in the simulator's crashed state, so parked layout, fresh placement, and the off-edge collapsed circle remain open.
- **Leg 2** — The fuel slider accepted keyboard input, but gross weight and tank readings stayed at the full-fuel values while the simulator reported a crash. The slider returned to 100%. Hardware actuation, the native rigid-body mass update, and matched takeoff rolls remain open.
- **Leg 3** — Flight checks remain open.
- **Leg 4** — Triggering Structural from the Failure Simulator opened **CONTINGENCY SOLUTION: STRUCTURAL AIRFRAME DAMAGE** immediately, with the permanent failure's recovery control disabled. **Clear All Failures** removed the contingency checklist. This closes the checklist presentation finding. Airborne failure and recovery checks remain open.
- **Leg 5** — Approach, landing, logbook persistence, and bundle export remain open.

The crash-overlay reset, native reset, and San Francisco 10R runway selection did not produce a confirmed usable aircraft state. Chrome control also timed out during the runway transition. Temporary Overpowered Engines and Failure Simulator settings were restored.

## V4.0 Export Retest

Chrome successfully downloaded the **Verification Bundle (JSON)** from **Logbook & Verification**. The file parsed as JSON and contained extension and script configuration, live telemetry, seven diagnostics, a logbook count of 100, and 20 recent logbook entries. This verifies export of existing data. A fresh touchdown and its persisted entry remain to be verified.

The GeoFS Bora Bora preset initialized a DHC-2 Beaver in flight with changing airspeed, altitude, and vertical speed. Chrome’s accessibility tree continued to expose the crash text during this flight, so that text alone is insufficient to identify a stalled simulation. A controlled runway spawn and the outstanding flight checks remain open.

## November 20 Runway And HUD Retest

With the HUD minimized, **Location → On Runway → San Francisco International Airport - 10R** accepted the runway selection. The DHC-2 Beaver reported 30.7 KIAS, 128 ft AGL, and 2,145 ft/min vertical speed after the transition. A stable parked baseline was still open.

The expanded HUD measured 250 px wide. Dragging its grip moved it from viewport coordinates (0, 0) to (386, 115). Chrome showed **Restore HUD** after minimizing at that position. The collapsed dimensions and restoration at that position still need measurement.

During this run, GeoFS stopped rendering with an invalid array length error. A tab reload then failed to initialize WebGL and construct the Cesium widget. This prevented further flight checks in this session. The simulator's preference reset was left untouched.

On the next Chrome session, GeoFS initialized with a Piper Cub near ground level. The collapsed HUD reappeared at the left edge, measured 24 × 40 CSS px, and restored the full HUD on click. The earlier off-edge position was not reproduced on startup. Chrome automation timed out during the repeat drag-and-collapse sequence and again when reconnecting through the native Chrome controls. The off-edge dimensions and remaining flight checks are still open.

## November 28 Parked Piper Cub Retest

The unpacked extension ran in a fresh Chromium profile on live GeoFS V4. After the startup overlay cleared, three samples showed ground contact, no crash and 0.38–0.51 KIAS. The simulator page contained crash-panel text even when the aircraft's crash flag was false.

- At a 1280 × 720 viewport the fresh HUD measured 250 × 501 px at (976, 70). After dragging it to (1030, 105), the off-edge circle measured 40 × 40 px. Expanding restored the same position and size.
- In CHECKS, GUIDE opened Situational Procedures Guide. Expanding Cold & Dark Engine Start Guide displayed its reference steps while the aircraft reported ground contact at 0.02 KIAS.
- Before the fuel fix, a pilot-selected 10% load showed 427 kg while the rigid body still reported 431.5 kg. The fixed build changed both definition and rigid-body mass from 467.5 kg at 100% to 427 kg at 10%. The corresponding FUEL_MASS_SYNC event reported 427 kg and rigidBodySynced true. Returning to 100% restored both to 467.5 kg. Ground contact remained true throughout.
