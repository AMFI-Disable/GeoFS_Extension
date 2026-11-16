# GeoFS Extension Parity To-Do

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**. Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

## Aircraft Sound And Realism Parity

- [x] Recover the original 737 Immersion SFX source and audio assets. Located upstream `Ariakim-Taiyo/GeoFs-737-Immersion-SFX` and `kolos26/GeoFs-737-Immersion-SFX-for-Realism-Addon` (live `editmysite.com` audio + `737_autopilot_disconnect.mp3`), and ported 737 engine/cabin/flaps/reverse/overspeed/touchdown/GPWS/TCAS/AP-disconnect cues into `src/modules/realism-pack/aircraft-sounds.ts`.
- [x] Compare the 777 and Airbus ports with their original expansions. Completed remaining cues in `src/modules/realism-pack/aircraft-sounds.ts`, including Airbus PTU, windshear (`isWindWarn`), TCAS (`traffic`/`climb`/`descend`/`clear`), and `sounds[3]`/`sounds[4]` volume ratios.
- [x] Port the 777 ground effect, stall buffeting, tiller, spoiler vibration, wing flex, and gear tilt against the corresponding aircraft definitions. Implemented in `RealismPackModule.update777Effects()` (`src/modules/realism-pack/index.ts`) with safe part validation and full `restoreAircraft()` cleanup.
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
