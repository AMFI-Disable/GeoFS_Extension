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
      "desc": "Consolidates Flight Path Vector HUD, Autothrottle, Realism Pack, Fuel Simulator, and Landing Stats into one extension."
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
  ]
} as const;
