# Agent Operational Guidelines And Repository Standards

This document is the unified, mandatory specification for all AI agents working in `AMFI-Disable/GeoFS_Extension`. It consolidates all workspace compliance policies, Git/GitHub conventions, strict template standards, and GeoFS-specific architectural rules.

---

## 1. Critical Compliance And Account Safety Rules

### Direct Binary And Executable Links Prohibition

- **Never Embed Direct Binary Links**: Never place direct download URLs to `.zip`, `.tar.gz`, `.dmg`, `.pkg`, `.exe`, `.app`, or compiled binaries inside `readme.md` or any Markdown file.
- **Use GitHub Releases Exclusively**: All packaged extension archives and distributables must be attached to official GitHub Releases (`https://github.com/AMFI-Disable/GeoFS_Extension/releases`).

### Educational Context And Fair-Play Disclaimer

- Any documentation or README for `GeoFS_Extension` must include the standard `> [!CAUTION]` fair-play and educational disclaimer callout.
- Never include or implement mechanisms designed to bypass GeoFS paid subscriptions, ad-reward entitlements, or platform access controls.

### Publishing And Release Gate

- **Do Not Publish Unprompted**: Never create Git tags, publish GitHub Releases, or upload packages without explicit user approval.

---

## 2. Git And Repository Conventions

### Git Identity And Remote URLs

- **Author Name**: `AMFI-Disable` (case-sensitive).
- **Author Email**: `evengao6688@gmail.com`.
- **Remote URL**: `https://github.com/AMFI-Disable/GeoFS_Extension.git` (strictly preserve `AMFI-Disable` casing).

### Sync Completed Work

After each completed task with repository changes, fetch the upstream branch, integrate any incoming work, run the verification checklist, and push the verified commits to the corresponding remote branch. Rebuild the local unpacked extension when its contents change. Preserve both histories when reconciling divergence.

### Strict Commit Message Structure

Every commit message must strictly match the format `type: word1 word2 word3`:

- **Allowed Type Prefixes**: `feat:`, `fix:`, `docs:`, `ci:`, `chore:`, `refactor:`, `test:`, `perf:`, `style:`.
- **Exactly Three Lowercase Words**: One space after the colon, followed by exactly three lowercase alphanumeric words (`^[a-z]+: [a-z0-9]+ [a-z0-9]+ [a-z0-9]+$`).
- **No Scopes Or Punctuation**: Never use `feat(ui): ...` or trailing periods.
- **Examples**: `feat: add fuel burn`, `fix: guard aircraft init`, `docs: update agents guide`, `ci: add test workflow`.

### File And Directory Naming

- All files and directories tracked in Git must use **strictly lowercase naming** with hyphen (`-`) or underscore (`_`) separators (e.g. `agents.md`, `readme.md`, `changelog.md`, `security.md`, `license`, `ci.yml`).
- CamelCase or capitalized filenames/directories are prohibited for newly created or refactored files.

### Document Header Formatting

- All Markdown headings (`#`, `##`, `###`) must use **Title Case** in natural human words (e.g., `# Project Setup Guidelines`).

### Versioning Conventions

- Extension and script versions must follow `v0.x.x` (e.g., `v0.1.0`, `v0.2.0`), strictly distinguishing extension versions from the GeoFS simulator version (`V3.x` / `V4.x`).
- Git release tags must use lowercase `v<MAJOR>.<MINOR>.<PATCH>` (e.g., `v0.1.0`).

---

## 3. Repository Template Standards

### Required Root Files

- `readme.md` (using the Browser Extension / Userscript archetype with centered hero header, `style=flat-square` Shields.io badges, `> [!CAUTION]` disclaimer, keyboard hotkeys table, and setup instructions)
- `changelog.md` (Keep a Changelog format with Title Case headers)
- `security.md` (with `## Supported Versions`, `## Reporting A Vulnerability`, and private reporting via GitHub Security or `evengao6688@gmail.com`)
- `license` (lowercase, no extension, MIT `Copyright (c) 2026 AMFI-Disable`)
- `.gitignore` (two-section structure: Section 1 explicit whitelists `!src/`, `!public/`, `!readme*.md`, `!changelog.md`, `!security.md`, `!license`, `!.gitignore`, `!.github/`; Section 2 hidden/ignored artifacts `node_modules/`, `dist/`, `release/`, `.DS_Store`, `*.log`, `.env*`)

### Shields.io Badge Rules

- Always use `style=flat-square`.
- Both Label and Value must use Title Case.
- Never link badges directly to `.zip` or raw binary files.

### Link Integrity

- Use repository-relative lowercase paths for all internal links (e.g., `[Changelog](changelog.md)`, `[License](license)`).
- Never commit local filesystem paths (`file:///...`).

---

## 4. GeoFS Extension Architecture Instructions

### Dual-World Manifest V3 Bridge

- **`world: "MAIN"` (`src/content/main.ts`)**: Runs directly in the GeoFS page context (`www.geo-fs.com/geofs.php*` and `beta.geo-fs.com/geofs.php*`) with typed access to `window.geofs`, `controls`, and `Cesium`.
- **`world: "ISOLATED"` (`src/content/bridge.ts`)**: Bridges `chrome.storage.sync` (settings/keybinds) and `chrome.storage.local` (landing logbook) to the `MAIN` world via `window.postMessage`.
- **Zero External `@require` Chains**: All core, UI, and module code must be self-contained inside the extension bundle.

### Unified V3 And V4 Compatibility

- **Major Version Detection**: Detect GeoFS major version (`3` or `4`) via `parseSimMajor(window.geofs?.version)` and ignore minor versions (`3.9.x` → `3`, `4.0.x` / `4.1.x` → `4`).
- **Unified `SimAdapter`**: Normalize throttle channels (`controls.manipulatorSetters.setThrottle`, `controls.throttle`, `throttleLeft`, `throttleRight`, `throttle1..4`), flaps, gear, and aircraft classification (`ga-piston`, `turboprop`, `airliner-twin`, `airliner-quad`, `fighter`, `supersonic`, `specialized`).
- **Version-Adaptive Shaders**: Compile GLSL 3.00 ES (`in`/`out`, `texture`) for GeoFS V4 and GLSL 1.00 (`varying`, `texture2D`) for GeoFS V3.

### Modular Contract And Centralized Telemetry

- **Single `TelemetryBus`**: Never spawn per-module `setInterval` or `addFrameCallback` loops for flight telemetry; subscribe to `TelemetryBus` instead.
- **Strict `IModule` Lifecycle**: Every addon module must implement `init(context)`, optional `update(telemetry)` / `onSettingsChange(settings)`, and `destroy()` with complete DOM/listener cleanup for leak-free hot-toggling.
- **Web Audio Synthesis**: Prefer `AudioEngine` (`AudioContext`, oscillators, filters) over bulky audio downloads.

### UI, Theming, And Controls

- **Minimalist Aesthetics**: Preserve GeoFS V3.9's clean glassmorphic style (`rgba(0, 0, 0, 0.8)`, `1px solid #888`, `border-radius: 15px`, Helvetica/Arial) with dynamic Day/Night auto-theming synced to GeoFS solar elevation / time.
- **Native Bar Anchoring**: Dock in-game controls to GeoFS's native `top`, `bottom`, `right` (radio stack), and `corner` zones, scaled by the popup's Screen Calibrator presets (`1080p`, `1440p`, `4k`, `ultrawide`, `laptop`).
- **OS-Aware Keybindings**: Auto-detect macOS vs. Windows/Linux for modifier formatting and guard against firing while typing in inputs.
- **Preact Popup**: Keep the popup UI in TypeScript + Preact (`src/popup/`).

### Legacy Userscripts Preservation

- Keep archived standalone `.user.js` scripts in `userscripts/v3.9/` and `userscripts/v4.0/` intact until the Chrome Extension reaches full feature parity and the user approves their removal.

---

## 5. Mandatory Pre-Flight Verification Checklist

Before committing or pushing any change:

1. [ ] **Typecheck And Tests**: Run `npm run typecheck`, `npm test`, and `npm run build` with zero errors.
2. [ ] **No Direct Binary Links**: Verify `readme.md` and docs contain no direct `.zip` / `.dmg` / `.exe` URLs.
3. [ ] **Git Identity**: Verify `user.name` is `AMFI-Disable` and `user.email` is `evengao6688@gmail.com`.
4. [ ] **Remote Casing**: Verify `origin` is `https://github.com/AMFI-Disable/GeoFS_Extension.git`.
5. [ ] **Strict Commit Message**: Verify commit matches `^[a-z]+: [a-z0-9]+ [a-z0-9]+ [a-z0-9]+$`.
6. [ ] **Lowercase Filenames**: Verify all newly added files and directories are strictly lowercase.
7. [ ] **Title Case Headers**: Verify all Markdown headings use Title Case.
8. [ ] **No Unapproved Releases**: Hold all tags and GitHub Releases until explicitly requested.
