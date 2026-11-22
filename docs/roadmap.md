# GeoFS Extension Roadmap And Awaiting Planes

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

This document tracks all aircraft (`AIRCRAFT_CATALOG` entries, OEW/MTOW/fuel specs, autothrottle PID tuning, and type-specific checklists) as well as upcoming feature milestones for `GeoFS_Extension`.

---

## Completed Aircraft Profiles (`SimAdapter`)

Currently implemented in [sim-adapter.ts](../src/core/sim-adapter.ts):

| GeoFS ID | Aircraft | Category | Engines |
| :--- | :--- | :--- | :--- |
| `1` | Piper Cub | `ga-piston` | 1 |
| `2` | Cessna 172 | `ga-piston` | 1 |
| `10` | Airbus A380 | `airliner-quad` | 4 |
| `16` | Douglas DC-3 | `ga-piston` | 2 |
| `18` | Sukhoi Su-35 | `fighter` | 2 |
| `20` | Concorde | `supersonic` | 4 |
| `22` | Cessna 152 | `ga-piston` | 1 |
| `23` | Piper PA-28 Warrior II | `ga-piston` | 1 |
| `24` | Airbus A350-900 | `airliner-twin` | 2 |
| `25` | Boeing 777-300ER | `airliner-twin` | 2 |
| `27` | Boeing F/A-18F Super Hornet | `fighter` | 2 |
| `29` | Dassault Rafale | `fighter` | 2 |
| `242` | Airbus A321neo | `airliner-twin` | 2 |
| `2953` | Space Shuttle Atlantis | `specialized` | 3 |
| `2973` | Airbus A350-1000 XWB | `airliner-twin` | 2 |
| `3179` | Boeing 787-10 | `airliner-twin` | 2 |
| `5086` | Airbus A321-211 | `airliner-twin` | 2 |
| `5193` | Boeing 747-8i | `airliner-quad` | 4 |
| `5527` | Boeing 747-400 | `airliner-quad` | 4 |
| `5551` | Comac C919-100 | `airliner-twin` | 2 |
| `5566` | Embraer E175 | `airliner-twin` | 2 |

---

## Awaiting Planes Queue

Aircraft covered via dedicated `AIRCRAFT_CATALOG` IDs or `NAMED_AIRCRAFT_SPECS` entries in [aircraft-catalog.ts](../src/core/aircraft-catalog.ts) (OEW, MTOW, max fuel, flap detents, V-speeds, and category checklists). Unchecked items remain queued for future addition.

### Commercial Twin-Engine Airliners

- [x] Airbus A220-300 (`airliner-twin`)
- [x] Airbus A319 / A320-214 / A320neo (`airliner-twin`)
- [x] Airbus A330-300 / A330-900neo (`airliner-twin`)
- [x] Boeing 717-200 (`airliner-twin`)
- [x] Boeing 737-700 / 737-800 / 737 MAX 8 (`airliner-twin`)
- [x] Boeing 757-200 / 757-300 (`airliner-twin`)
- [x] Boeing 767-300ER (`airliner-twin`)
- [x] Boeing 777-200ER / 777F (`airliner-twin`)
- [x] Boeing 787-8 / 787-9 (`airliner-twin`)
- [x] Bombardier CRJ-700 / CRJ-900 (`airliner-twin`)
- [x] Embraer E190 / E195-E2 (`airliner-twin`)
- [x] McDonnell Douglas MD-80 / MD-90 (`airliner-twin`)

### Commercial Quad-Engine And Tri-Jet Heavy Aircraft

- [x] Airbus A340-300 / A340-600 (`airliner-quad`)
- [x] Antonov An-124 / An-225 Mriya (`airliner-quad`)
- [x] Boeing 747-100 / 747-200 / 747SP (`airliner-quad`)
- [x] McDonnell Douglas MD-11 / DC-10 (`airliner-twin` / tri-jet handling)
- [x] Lockheed L-1011 TriStar (`airliner-twin` / tri-jet handling)

### Turboprops And Regional Commuters

- [x] ATR 42-600 / ATR 72-600 (`turboprop`)
- [x] Beechcraft King Air 350i (`turboprop`)
- [x] De Havilland Canada Dash 8 Q400 (`turboprop`)
- [x] De Havilland Canada DHC-6 Twin Otter (`turboprop`)
- [x] Pilatus PC-12 (`turboprop`)
- [x] Saab 340 (`turboprop`)

### General Aviation, Business Jets, And Classics

- [x] Beechcraft Baron G58 / B55 (`ga-piston`)
- [x] Beechcraft Bonanza (`ga-piston`)
- [x] Cessna 182 / 208 Caravan (`ga-piston` / `turboprop`)
- [x] Cessna Citation X / CJ4 (`airliner-twin` / bizjet preset)
- [x] Cirrus SR22 / SF50 Vision Jet (`ga-piston` / bizjet preset)
- [x] Diamond DA40 / DA42 (`ga-piston`)
- [x] Gulfstream G550 / G650 (`airliner-twin` / bizjet preset)
- [x] Pitts Special S-2B / S1 (`ga-piston`)
- [x] Robin DR400 (`ga-piston`)

### Military, Fighters, And Supersonic

- [x] Boeing F-15E Strike Eagle (`fighter`)
- [x] Eurofighter Typhoon (`fighter`)
- [x] General Dynamics F-16C Fighting Falcon (`fighter`)
- [x] Lockheed Martin F-22A Raptor (`fighter`)
- [x] Lockheed Martin F-35A/B/C Lightning II (`fighter`)
- [x] Lockheed SR-71 Blackbird (`supersonic`)
- [x] Mikoyan MiG-29 / MiG-31 (`fighter` / `supersonic`)
- [x] North American P-51 Mustang (`ga-piston` / warbird)
- [x] Saab JAS 39 Gripen (`fighter`)
- [x] Tupolev Tu-144 (`supersonic`)

### Helicopters And Rotorcraft

- [x] Bell 206 / Bell 407 (`rotorcraft`)
- [x] Eurocopter EC135 / H145 (`rotorcraft`)
- [x] Robinson R22 / R44 (`rotorcraft`)
- [x] Sikorsky UH-60 Black Hawk (`rotorcraft`)

### Experimental, Gliders, And Spacecraft

- [x] Northrop Grumman B-2 Spirit (`specialized`)
- [x] North American X-15 (`specialized`)
- [x] SpaceX Falcon 9 (`specialized`)
- [x] Standard Sailplanes / ASK 21 (`specialized` / glider)

---

## Extension Milestones

### Version `v0.2.0`

- [x] Dedicated `rotorcraft` aircraft category in `SimAdapter` with collective and available torque telemetry and helicopter checklists.
- [x] Per-aircraft V-speed reference cards (`V1`, `VR`, `V2`, `Vref`, `Vfe`, `Vne`) integrated into Information Display and Checklist System. Values come from GeoFS aircraft definitions, aircraft catalog defaults when the definition has no speeds, or user overrides.
- [x] Custom user-editable aircraft profile overrides stored in `chrome.storage.sync`.
- [x] Landing replay capture and export (JSON/CSV) from the Logbook popup tab.
- [x] Name-matched `NAMED_AIRCRAFT_SPECS` profiles for Airbus A320/A330/A340, Boeing 737-800/MAX 8/757/767, ATR 72-600, Dash 8 Q400, King Air 350i, F-16C, F-22A, F-35A, Eurofighter Typhoon, SR-71, Robinson R44, Bell 407, and UH-60 Black Hawk.
