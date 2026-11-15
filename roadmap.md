# GeoFS Extension Roadmap And Awaiting Planes

> [!CAUTION]
> **Educational And Fair-Play Disclaimer**: Use this extension for education and single-player simulation. Respect GeoFS subscriptions, ad-reward entitlements, multiplayer rules, and access controls.

This document tracks all aircraft (`AIRCRAFT_CATALOG` entries, OEW/MTOW/fuel specs, autothrottle PID tuning, and type-specific checklists) as well as upcoming feature milestones for `GeoFS_Extension`.

---

## Completed Aircraft Profiles (`SimAdapter`)

Currently implemented in [sim-adapter.ts](src/core/sim-adapter.ts):

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

Aircraft awaiting dedicated `AIRCRAFT_CATALOG` entries (OEW, MTOW, max fuel, flap detents, autothrottle tuning, and bespoke checklist items). Community-contributed GeoFS aircraft IDs fall back to dynamic classification until added here.

### Commercial Twin-Engine Airliners

- [ ] Airbus A220-300 (`airliner-twin`)
- [ ] Airbus A319 / A320-214 / A320neo (`airliner-twin`)
- [ ] Airbus A330-300 / A330-900neo (`airliner-twin`)
- [ ] Boeing 717-200 (`airliner-twin`)
- [ ] Boeing 737-700 / 737-800 / 737 MAX 8 (`airliner-twin`)
- [ ] Boeing 757-200 / 757-300 (`airliner-twin`)
- [ ] Boeing 767-300ER (`airliner-twin`)
- [ ] Boeing 777-200ER / 777F (`airliner-twin`)
- [ ] Boeing 787-8 / 787-9 (`airliner-twin`)
- [ ] Bombardier CRJ-700 / CRJ-900 (`airliner-twin`)
- [ ] Embraer E190 / E195-E2 (`airliner-twin`)
- [ ] McDonnell Douglas MD-80 / MD-90 (`airliner-twin`)

### Commercial Quad-Engine And Tri-Jet Heavy Aircraft

- [ ] Airbus A340-300 / A340-600 (`airliner-quad`)
- [ ] Antonov An-124 / An-225 Mriya (`airliner-quad`)
- [ ] Boeing 747-100 / 747-200 / 747SP (`airliner-quad`)
- [ ] McDonnell Douglas MD-11 / DC-10 (`airliner-twin` / tri-jet handling)
- [ ] Lockheed L-1011 TriStar (`airliner-twin` / tri-jet handling)

### Turboprops And Regional Commuters

- [ ] ATR 42-600 / ATR 72-600 (`turboprop`)
- [ ] Beechcraft King Air 350i (`turboprop`)
- [ ] De Havilland Canada Dash 8 Q400 (`turboprop`)
- [ ] De Havilland Canada DHC-6 Twin Otter (`turboprop`)
- [ ] Pilatus PC-12 (`turboprop`)
- [ ] Saab 340 (`turboprop`)

### General Aviation, Business Jets, And Classics

- [ ] Beechcraft Baron G58 (`ga-piston`)
- [ ] Beechcraft Bonanza (`ga-piston`)
- [ ] Cessna 182 / 208 Caravan (`ga-piston` / `turboprop`)
- [ ] Cessna Citation X / CJ4 (`airliner-twin` / bizjet preset)
- [ ] Cirrus SR22 / SF50 Vision Jet (`ga-piston`)
- [ ] Diamond DA40 / DA42 (`ga-piston`)
- [ ] Gulfstream G550 / G650 (`airliner-twin` / bizjet preset)
- [ ] Pitts Special S-2B (`ga-piston`)
- [ ] Robin DR400 (`ga-piston`)

### Military, Fighters, And Supersonic

- [ ] Boeing F-15E Strike Eagle (`fighter`)
- [ ] Eurofighter Typhoon (`fighter`)
- [ ] General Dynamics F-16C Fighting Falcon (`fighter`)
- [ ] Lockheed Martin F-22A Raptor (`fighter`)
- [ ] Lockheed Martin F-35A/B/C Lightning II (`fighter`)
- [ ] Lockheed SR-71 Blackbird (`supersonic`)
- [ ] Mikoyan MiG-29 / MiG-31 (`fighter` / `supersonic`)
- [ ] North American P-51 Mustang (`ga-piston` / warbird)
- [ ] Saab JAS 39 Gripen (`fighter`)
- [ ] Tupolev Tu-144 (`supersonic`)

### Helicopters And Rotorcraft

- [ ] Bell 206 / Bell 407 (`specialized` / rotorcraft)
- [ ] Eurocopter EC135 / H145 (`specialized` / rotorcraft)
- [ ] Robinson R22 / R44 (`specialized` / rotorcraft)
- [ ] Sikorsky UH-60 Black Hawk (`specialized` / rotorcraft)

### Experimental, Gliders, And Spacecraft

- [ ] Northrop Grumman B-2 Spirit (`specialized`)
- [ ] North American X-15 (`specialized`)
- [ ] SpaceX Falcon 9 / Starship (`specialized`)
- [ ] Standard Sailplanes / ASK 21 (`specialized` / glider)

---

## Extension Milestones

### Version `v0.2.0`

- [x] Dedicated `rotorcraft` aircraft category in `SimAdapter` with collective and available torque telemetry and helicopter checklists.
- [x] Per-aircraft V-speed reference cards (`V1`, `VR`, `V2`, `Vref`, `Vfe`, `Vne`) integrated into Information Display and Checklist System. Values come from GeoFS aircraft definitions or user overrides.
- [x] Custom user-editable aircraft profile overrides stored in `chrome.storage.sync`.
- [x] Landing replay capture and export (JSON/CSV) from the Logbook popup tab.
