export const siteConfig = {
  "title": "GeoFS Extension",
  "repoUrl": "https://github.com/AMFI-Disable/GeoFS_Extension",
  "category": "Browser Extension",
  "accent": "#66BB6A",
  "tagline": "All-in-one Manifest V3 Chrome extension and flight deck companion for GeoFS V3.9 and V4.0.",
  "primaryCta": {
    "label": "Install Extension",
    "href": "#quick-start"
  },
  "secondaryCta": {
    "label": "View on GitHub",
    "href": "https://github.com/AMFI-Disable/GeoFS_Extension"
  },
  "quickCmd": "git clone https://github.com/AMFI-Disable/GeoFS_Extension.git && cd GeoFS_Extension && npm ci && npm run build",
  "features": [
    {
      "title": "Unified Flight Deck",
      "desc": "Consolidates Flight Path Vector HUD, Autothrottle, AP++ (VNAV, Holds, Autoland, Hover), Gate Spawner, Realism Lighting & LiDAR, Fuel Simulator, and 1–5 Star Landing Evaluation."
    },
    {
      "title": "Zero Script Conflicts",
      "desc": "Replaces a dozen separate userscripts with one coordinated Manifest V3 lifecycle and shared state bus."
    },
    {
      "title": "GeoFS V3.9 & V4.0",
      "desc": "Works seamlessly on both www.geo-fs.com (V3.9) and beta.geo-fs.com (V4.0) with Day/Night cockpit theming."
    },
    {
      "title": "Aircraft-Aware Profiles",
      "desc": "Includes speed profiles, fuel weights, and interactive checklists for props, airliners, fighters, and helicopters."
    },
    {
      "title": "Live Module Toggles",
      "desc": "Enable or disable individual avionics addons mid-flight from the popup without reloading the tab."
    },
    {
      "title": "Strict TypeScript & Tests",
      "desc": "Built with TypeScript, Vite, and Vitest for predictable avionics math and UI synchronization."
    }
  ],
  "steps": [
    {
      "title": "Manifest V3 Injection",
      "desc": "Injects a unified bridge into the GeoFS simulation loop without polluting global page scripts."
    },
    {
      "title": "Modular Addon Bus",
      "desc": "Coordinates telemetry, PID autothrottle, fuel burn, and failure triggers through a single shared state."
    },
    {
      "title": "Native Cockpit HUD",
      "desc": "Renders dark-glass instrumentation overlays and autopilot bar controls synced to Day/Night mode."
    }
  ],
  "installCmds": [
    {
      "label": "Build dist/ from Source",
      "cmd": "git clone https://github.com/AMFI-Disable/GeoFS_Extension.git && cd GeoFS_Extension && npm ci && npm run build"
    },
    {
      "label": "Run Unit Tests",
      "cmd": "npm test"
    }
  ],
  "requirements": [
    "Chrome, Edge, or Brave (Manifest V3)",
    "Node.js 20+ (to build from source)",
    "Educational & single-player simulation use"
  ],
  "hubName": "AMFI Hangar",
  "hubHash": "hangar",
  "previewTabs": [
    {
      "tab": "Cockpit HUD",
      "title": "Flight Path Vector & PFD",
      "body": "Projects true ECEF velocity vectors, airspeed, attitude, and wind telemetry in native dark-glass panels."
    },
    {
      "tab": "Autothrottle",
      "title": "Closed-Loop PID Speed",
      "body": "Holds target IAS/Mach with automated retard logic during landing flare on GeoFS V3.9 & V4.0."
    },
    {
      "tab": "Live Toggles",
      "title": "Zero-Reload Modules",
      "body": "Enable or disable Realism Pack, Fuel Simulator, Failures, and Checklists mid-flight from the popup."
    }
  ]
} as const;
