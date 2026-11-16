# GeoFS Extension Parity To-Do

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**. Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

## Aircraft Sound And Realism Parity

- [ ] Recover the original 737 Immersion SFX source and audio assets. The archived source URL returns 404 and the local 737 file is a placeholder. Confirm reuse terms and archive the source before porting it into the extension lifecycle.
- [ ] Compare the 777 and Airbus ports with their original expansions. Verify engine layers, startup, flap sounds, warning thresholds, and radio-altitude callouts. Complete the remaining cues, including Airbus PTU, windshear, and TCAS behavior.
- [ ] Port the 777 ground effect, stall buffeting, tiller, spoiler vibration, wing flex, and gear tilt against the corresponding aircraft definitions. Validate each aircraft variant before applying changes to model parts or animation bindings.
- [x] Confirm which Realism Pack settings were functional in the original scripts. Functional behavior (`gForce`, `blackout`, `cameraShake`, `spoilerArming`, `performanceMode`, `soundEffects`, `vnlkRunway`) is preserved; archived empty stubs (`initVortexEffects`, `initFBW`, `initEjections`) are recorded as placeholders.

## Live Simulator Verification

- [ ] Install the current unpacked build in Chrome and test both GeoFS V3.9 and V4.0 against the corresponding archived standalone suite. Test live toggling, aircraft changes, respawns, and repeated enable/disable cycles.
- [ ] Verify thrust, reverse, landing retard, and native autopilot interaction with Autothrottle and Overpowered Engines active together.
- [ ] Verify fuel mass, burn, refueling, and flameout recovery. Compare fallback aircraft profiles with the archived scripts and exercise fuel-imbalance torque with asymmetrical tanks.
- [ ] Verify grouped failures, engine smoke cleanup, cockpit blackout, emergency checklists, and failure recovery while other modules are active.
- [ ] Fly normal, bounced, hard, and off-target landings. Check report timing, landing audio, scoring, calibrated vertical speed, and replay/logbook exports.
- [x] Check the logbook for lost records when stable and beta tabs write concurrently. Serialized all logbook writes through `src/background/service-worker.ts` (`SerializedLogbookStore`) with ID deduplication and unit tests.
- [ ] Verify the Realism Pack shader, G-force audio, rotorcraft effects, aircraft sound cleanup, and runway visibility at VNLK and after leaving it.

## Parity Boundaries

- Preserve the archived userscripts. Keep all ports on the shared telemetry bus and ensure effects are reversible through live toggles.
- V3 imagery parity covers providers and settings the user can legitimately access. Preserve GeoFS entitlement checks.
- Keep landing records in extension storage. The archived V3 third-party telemetry upload stays out of the port.
