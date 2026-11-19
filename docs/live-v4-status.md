# GeoFS V4.0 Live Verification Status

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

Updated November 19, 2026. The latest Chrome check used the unpacked v0.2.1 build against GeoFS 4.0 Beta. Full five-leg verification remains open.

| Leg | Latest Evidence | Remaining Verification |
| --- | --- | --- |
| 1. Cold Check | On the V4 A380, the extension mounted and showed all four titleless HUD tabs on one row at 250 px wide. At the existing left-edge position, minimizing exposed a 24 × 40 px handle that restored the HUD. Chrome’s docked Side Panel showed live A380 telemetry, `UI_MOUNT`, and `REALISM_STATE`. After rebuilding and reloading, **Realism & Fuel** showed its controls and disabled **Vortex Effects** and **Carrier Ops**, each labeled **Unavailable on V4**. **OP / Diag** still showed boost controls and diagnostics. | Verify fresh default placement, the 40 × 40 px collapsed circle away from the edge, and the expanded A/THR and OP ENG layout in an extension-only parked session. |
| 2. Checklist And Fuel | The original V4 test found issues in lights actuation, rigid-body fuel mass, and live-thrust fuel burn. Fixes landed in `c735538`. The later A380 check confirmed the checklist gates and fuel UI rendered. | Repeat the hardware actuation, rigid-body mass and matched takeoff-roll checks against the fixed build. |
| 3. Climb, OP-SYNC And SAS | The original V4 test confirmed the boost permission prompt, thrust handoff and restoration. Gear direction, SAS hold and release diagnostics needed fixes, which landed in `6130e10`. The Leg 4 session confirmed the updated gear adapter and release diagnostic code was loaded. | Repeat the climb and sustained SAS hold and turning checks, and validate the gear checklist and release event in flight. |
| 4. Failures And Recovery | Parked A380 tests verified injection, matching emergency checklists, successful recoveries, failed pitot recovery, and combined cleanup. Permanent structural damage kept the emergency QRH heading while recovery was unavailable. | Resolve the structural contingency presentation and repeat applicable checks airborne. |
| 5. Approach And Landing | The latest V4 session showed the Glideslope widget. | Verify the rendered high-resolution FPV marker on approach, landing retard, spoilers, touchdown scoring, persisted logbook, chocks and verification bundle through a completed flight. |

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
