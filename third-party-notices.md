# Third-Party Notices

This project incorporates or draws inspiration from the following open-source and community resources:

## MIT-Licensed Port

### GeoFS-headlights (`frietjesbeer/GeoFS-headlights`)
- Source: https://github.com/frietjesbeer/GeoFS-headlights
- License: MIT License
- Used in: [`src/modules/realism-pack/lighting/light-shader.ts`](src/modules/realism-pack/lighting/light-shader.ts) and [`src/modules/realism-pack/lighting/aircraft-lights.ts`](src/modules/realism-pack/lighting/aircraft-lights.ts) (Cesium `PostProcessStage` depth-buffer spotlight/point-light shader, aircraft frame transforms, and 19 per-aircraft lamp layouts).

```text
MIT License

Copyright (c) 2026 frietjesbeer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### GeoFS Gate Spawner (`machpoint82/geofs-gate-spawner`)
- Source: https://github.com/machpoint82/geofs-gate-spawner
- License: MIT License (Copyright (c) 2026 machpoint82)
- Used in: [`src/modules/gate-spawner/index.ts`](src/modules/gate-spawner/index.ts) (gate coordinate offset math, category filters, and no-reload `ac.place` gate placement).

## Open Data Attribution

### OpenStreetMap (`aeroway=taxiway`)
- Data: © OpenStreetMap contributors, available under the Open Database License (ODbL).
- Used in: Opt-in [`src/modules/realism-pack/lighting/taxiway-lights.ts`](src/modules/realism-pack/lighting/taxiway-lights.ts).

## Clean-Room Rewrites (Behavior Inspiration Only)

- **Runway Light Pavement Glow** ([`src/modules/realism-pack/lighting/runway-glow.ts`](src/modules/realism-pack/lighting/runway-glow.ts)): Independently written using GeoFS's native `geofs.fx.litRunways` API, inspired by the runway-lighting concept in `Ariakim-Taiyo/GeoFS-Experiments`.
- **OSM Taxiway Lights** ([`src/modules/realism-pack/lighting/taxiway-lights.ts`](src/modules/realism-pack/lighting/taxiway-lights.ts)): Independently written using Overpass API queries and `geofs.runways.nearRunways`, inspired by `tylerbmusic/GeoFS-Taxiway-Lights`, with zero third-party telemetry.
- **Exterior Light Presets** (Cold & Dark / Takeoff): Inspired by `Mahe40Landes/geofs-exterior-lights`.
